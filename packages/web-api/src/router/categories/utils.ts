import { eq, sql } from "@qco/db";
import { categories, productCategories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import type { TRPCContext } from "../../trpc";



/**
 * Получает количество продуктов для каждой категории (только прямые товары в категории)
 */
export async function getCategoryProductsCount(ctx: TRPCContext): Promise<Map<string, number>> {
    // Получаем прямые связи продуктов с категориями
    const directProductCounts = await ctx.db
        .select({
            categoryId: productCategories.categoryId,
            count: sql<number>`count(*)`,
        })
        .from(productCategories)
        .groupBy(productCategories.categoryId);

    // Возвращаем мапу с прямым количеством товаров для каждой категории
    return new Map<string, number>(
        directProductCounts.map(({ categoryId, count }) => [categoryId, Number(count)]),
    );
}

/**
 * Получает информацию о дочерних категориях
 */
export async function getCategoryChildrenInfo(ctx: TRPCContext): Promise<Map<string, boolean>> {
    const childrenInfo = await ctx.db
        .select({
            parentId: categories.parentId,
        })
        .from(categories)
        .where(sql`${categories.parentId} IS NOT NULL`);

    const hasChildrenMap = new Map<string, boolean>();

    childrenInfo.forEach(({ parentId }) => {
        if (parentId) {
            hasChildrenMap.set(parentId, true);
        }
    });

    return hasChildrenMap;
}

/**
 * Форматирует изображение категории
 */
export function formatCategoryImage(image: any) {
    if (!image) return null;

    return {
        fileId: image.id,
        url: getFileUrl(image.path),
        meta: {
            name: image.name || "",
            mimeType: image.mimeType || "",
            size: image.size || 0,
        },
    };
}

/**
 * Вычисляет уровень категории в иерархии
 */
export function calculateCategoryLevel(parentId: string | null, categoryMap: Map<string, any>): number {
    if (!parentId) return 0;

    const parent = categoryMap.get(parentId);
    if (!parent) return 0;

    return calculateCategoryLevel(parent.parentId, categoryMap) + 1;
}

/**
 * Форматирует категорию для ответа API
 */
export async function formatCategory(
    category: any,
    productsCountMap: Map<string, number>,
    hasChildrenMap: Map<string, boolean>,
    categoryMap?: Map<string, any>,
): Promise<any> {
    const productsCount = productsCountMap.get(category.id) ?? 0;
    const hasChildren = hasChildrenMap.get(category.id) ?? false;
    const level = categoryMap ? calculateCategoryLevel(category.parentId, categoryMap) : 0;

    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        xmlId: category.xmlId,
        description: category.description,
        parentId: category.parentId,
        imageId: category.imageId,
        image: formatCategoryImage(category.image),
        isActive: category.isActive,
        isFeatured: category.isFeatured,
        sortOrder: category.sortOrder,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        metaKeywords: category.metaKeywords,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        // Вычисляемые поля для фронтенда
        productsCount,
        hasChildren,
        level,
    };
} 