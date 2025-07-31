import { eq, inArray, count } from "drizzle-orm";
import { categories, productCategories } from "@qco/db/schema";

// Функция для получения всех родительских категорий
export async function getAllParentCategoryIds(db: any, categoryId: string): Promise<string[]> {
    const parentIds: string[] = [];
    let currentCategoryId = categoryId;

    while (currentCategoryId) {
        const category = await db
            .select({ parentCategoryId: categories.parentId })
            .from(categories)
            .where(eq(categories.id, currentCategoryId))
            .limit(1);

        if (category.length > 0 && category[0].parentCategoryId) {
            parentIds.push(category[0].parentCategoryId);
            currentCategoryId = category[0].parentCategoryId;
        } else {
            break;
        }
    }

    return parentIds;
}

// Функция для получения всех категорий (включая родительские) для списка категорий
export async function getAllCategoriesWithParents(db: any, categoryIds: string[]): Promise<string[]> {
    const allCategoryIds = new Set<string>();

    for (const categoryId of categoryIds) {
        // Добавляем саму категорию
        allCategoryIds.add(categoryId);

        // Добавляем все родительские категории
        const parentIds = await getAllParentCategoryIds(db, categoryId);
        parentIds.forEach(id => allCategoryIds.add(id));
    }

    return Array.from(allCategoryIds);
}

// Функция для извлечения ID категорий из различных форматов входных данных
export function extractCategoryIds(categories: (string | { id: string; name: string })[]): string[] {
    return categories.map((category) =>
        typeof category === "string" ? category : category.id
    );
}

// Функция для пересчета количества продуктов в категориях
export async function recalculateCategoryProductsCount(db: any, categoryIds: string[]): Promise<void> {
    if (categoryIds.length === 0) return;

    try {
        // Получаем количество продуктов для каждой категории
        const categoryCounts = await db
            .select({
                categoryId: productCategories.categoryId,
                count: count(),
            })
            .from(productCategories)
            .where(inArray(productCategories.categoryId, categoryIds))
            .groupBy(productCategories.categoryId);

        // Создаем Map для быстрого доступа к количеству
        const countMap = new Map<string, number>();
        categoryCounts.forEach((item: any) => {
            countMap.set(item.categoryId, Number(item.count));
        });

        // Обновляем все категории одной транзакцией
        await db.transaction(async (tx: any) => {
            // Сначала сбрасываем счетчики всех указанных категорий в 0
            await tx
                .update(categories)
                .set({
                    productsCount: 0,
                    updatedAt: new Date()
                })
                .where(inArray(categories.id, categoryIds));

            // Затем обновляем только те категории, у которых есть продукты
            if (categoryCounts.length > 0) {
                for (const { categoryId, count: productCount } of categoryCounts) {
                    await tx
                        .update(categories)
                        .set({
                            productsCount: Number(productCount),
                            updatedAt: new Date()
                        })
                        .where(eq(categories.id, categoryId));
                }
            }
        });
    } catch (error) {
        console.error('Ошибка при пересчете количества продуктов в категориях:', error);
        throw error;
    }
}

// Функция для полного пересчета количества продуктов во всех категориях
export async function recalculateAllCategoryProductsCount(db: any): Promise<void> {
    // Получаем все категории
    const allCategories = await db
        .select({ id: categories.id })
        .from(categories);

    const categoryIds = allCategories.map((c: any) => c.id);

    // Пересчитываем productsCount для всех категорий
    await recalculateCategoryProductsCount(db, categoryIds);
} 
