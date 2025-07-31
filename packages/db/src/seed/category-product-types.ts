import type { PgTransaction } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import type * as schema from "../schemas";
import { categoryProductTypes, categories, productTypes } from "../schemas";

/**
 * Заполняет связи категорий с типами продуктов
 */
export async function seedCategoryProductTypes(tx: PgTransaction<any, typeof schema, any>) {
    console.log("🌱 Seeding category product types...");

    // Получаем существующие категории и типы продуктов
    const existingCategories = await tx.query.categories.findMany({
        columns: { id: true, slug: true },
    });

    const existingProductTypes = await tx.query.productTypes.findMany({
        columns: { id: true, slug: true },
    });

    if (existingCategories.length === 0 || existingProductTypes.length === 0) {
        console.log("⚠️ No categories or product types found, skipping category-product-types seeding");
        return;
    }

    // Маппинг категорий к типам продуктов
    const categoryProductTypeMappings = [
        // Женская одежда
        { categorySlug: "women", productTypeSlug: "clothing", isPrimary: true },
        { categorySlug: "women", productTypeSlug: "shoes", isPrimary: false },
        { categorySlug: "women", productTypeSlug: "accessories", isPrimary: false },

        // Мужская одежда
        { categorySlug: "men", productTypeSlug: "clothing", isPrimary: true },
        { categorySlug: "men", productTypeSlug: "shoes", isPrimary: false },
        { categorySlug: "men", productTypeSlug: "accessories", isPrimary: false },

        // Детская одежда
        { categorySlug: "kids", productTypeSlug: "clothing", isPrimary: true },
        { categorySlug: "kids", productTypeSlug: "shoes", isPrimary: false },
        { categorySlug: "kids", productTypeSlug: "accessories", isPrimary: false },

        // Аксессуары
        { categorySlug: "accessories", productTypeSlug: "accessories", isPrimary: true },

        // Красота
        { categorySlug: "beauty", productTypeSlug: "beauty", isPrimary: true },
    ];

    // Создаем связи
    for (const mapping of categoryProductTypeMappings) {
        const category = existingCategories.find(c => c.slug === mapping.categorySlug);
        const productType = existingProductTypes.find(pt => pt.slug === mapping.productTypeSlug);

        if (category && productType) {
            try {
                await tx.insert(categoryProductTypes).values({
                    categoryId: category.id,
                    productTypeId: productType.id,
                    isPrimary: mapping.isPrimary,
                    sortOrder: mapping.isPrimary ? 0 : 1,
                });
                console.log(`✅ Linked category "${mapping.categorySlug}" with product type "${mapping.productTypeSlug}"`);
            } catch (error) {
                // Игнорируем ошибки дублирования
                if (error instanceof Error && error.message.includes("duplicate")) {
                    console.log(`⚠️ Link already exists: ${mapping.categorySlug} -> ${mapping.productTypeSlug}`);
                } else {
                    console.error(`❌ Failed to link ${mapping.categorySlug} with ${mapping.productTypeSlug}:`, error);
                }
            }
        } else {
            console.log(`⚠️ Category "${mapping.categorySlug}" or product type "${mapping.productTypeSlug}" not found`);
        }
    }

    console.log("✅ Category product types seeding completed");
} 