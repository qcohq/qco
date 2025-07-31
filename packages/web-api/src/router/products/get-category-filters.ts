import { publicProcedure } from "../../trpc";
import { eq, inArray, and, sql } from "@qco/db";
import {
    products,
    productCategories,
    categories,
    brands,
    productVariants,
    productVariantOptions,
    productVariantOptionValues,
    productVariantOptionCombinations
} from "@qco/db/schema";
import {
    getCategoryFiltersSchema,
    getCategoryFiltersResponseSchema
} from "@qco/web-validators";

export const getCategoryFilters = publicProcedure
    .input(getCategoryFiltersSchema)
    .output(getCategoryFiltersResponseSchema)
    .query(async ({ ctx, input }) => {
        const { categorySlug } = input;

        // Получаем категорию и подкатегории
        let categoryIds: string[] = [];

        if (categorySlug === "all") {
            const allCategories = await ctx.db.query.categories.findMany({
                columns: { id: true },
            });
            categoryIds = allCategories.map((c: any) => c.id);
        } else {
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.slug, categorySlug),
            });

            if (!category) {
                return {
                    sizes: [],
                    colors: [],
                    brands: [],
                    priceRange: { min: 0, max: 0 },
                    totalProducts: 0
                };
            }

            const subcategories = await ctx.db.query.categories.findMany({
                where: eq(categories.parentId, category.id),
            });

            categoryIds = [category.id, ...subcategories.map((c: any) => c.id)];
        }

        // Получаем ID товаров в категории
        const productCategoryIds = await ctx.db
            .select({ productId: productCategories.productId })
            .from(productCategories)
            .where(inArray(productCategories.categoryId, categoryIds));

        const productIds = productCategoryIds.map((pc: any) => pc.productId);

        if (productIds.length === 0) {
            return {
                sizes: [],
                colors: [],
                brands: [],
                priceRange: { min: 0, max: 0 },
                totalProducts: 0
            };
        }

        // Получаем доступные размеры, цвета, бренды и ценовой диапазон
        const [sizesData, colorsData, brandsResult, priceData, totalProductsData] = await Promise.all([
            // Размеры - из опций вариантов
            ctx.db
                .select({
                    value: productVariantOptionValues.value,
                    displayName: productVariantOptionValues.displayName
                })
                .from(productVariantOptionValues)
                .innerJoin(productVariantOptions, eq(productVariantOptionValues.optionId, productVariantOptions.id))
                .innerJoin(productVariantOptionCombinations, eq(productVariantOptionValues.id, productVariantOptionCombinations.optionValueId))
                .innerJoin(productVariants, eq(productVariantOptionCombinations.variantId, productVariants.id))
                .where(and(
                    inArray(productVariants.productId, productIds),
                    eq(productVariantOptions.slug, 'size'),
                    eq(productVariants.isActive, true)
                )),

            // Цвета - из опций вариантов
            ctx.db
                .select({
                    value: productVariantOptionValues.value,
                    displayName: productVariantOptionValues.displayName,
                    metadata: productVariantOptionValues.metadata
                })
                .from(productVariantOptionValues)
                .innerJoin(productVariantOptions, eq(productVariantOptionValues.optionId, productVariantOptions.id))
                .innerJoin(productVariantOptionCombinations, eq(productVariantOptionValues.id, productVariantOptionCombinations.optionValueId))
                .innerJoin(productVariants, eq(productVariantOptionCombinations.variantId, productVariants.id))
                .where(and(
                    inArray(productVariants.productId, productIds),
                    eq(productVariantOptions.slug, 'color'),
                    eq(productVariants.isActive, true)
                )),

            // Бренды
            ctx.db
                .select({ name: brands.name })
                .from(products)
                .innerJoin(brands, eq(products.brandId, brands.id))
                .where(and(
                    inArray(products.id, productIds),
                    eq(products.isActive, true)
                )),

            // Ценовой диапазон - из товаров и их вариантов
            ctx.db
                .select({
                    minPrice: sql<number>`
                        LEAST(
                            COALESCE(MIN(${products.basePrice}), 999999999),
                            COALESCE(MIN(${products.salePrice}), 999999999),
                            COALESCE(MIN(${productVariants.price}), 999999999),
                            COALESCE(MIN(${productVariants.salePrice}), 999999999)
                        )
                    `,
                    maxPrice: sql<number>`
                        GREATEST(
                            COALESCE(MAX(${products.basePrice}), 0),
                            COALESCE(MAX(${products.salePrice}), 0),
                            COALESCE(MAX(${productVariants.price}), 0),
                            COALESCE(MAX(${productVariants.salePrice}), 0)
                        )
                    `
                })
                .from(products)
                .leftJoin(productVariants, and(
                    eq(products.id, productVariants.productId),
                    eq(productVariants.isActive, true)
                ))
                .where(and(
                    inArray(products.id, productIds),
                    eq(products.isActive, true)
                )),

            // Общее количество товаров
            ctx.db
                .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
                .from(products)
                .where(and(
                    inArray(products.id, productIds),
                    eq(products.isActive, true)
                ))
        ]);

        // Обрабатываем размеры - группируем по значению и подсчитываем количество
        const sizesMap = new Map();
        sizesData.forEach((s: any) => {
            const name = s.displayName || s.value;
            if (sizesMap.has(name)) {
                sizesMap.set(name, sizesMap.get(name) + 1);
            } else {
                sizesMap.set(name, 1);
            }
        });
        const sizes = Array.from(sizesMap.entries()).map(([name, count]) => ({ name, count }));

        // Обрабатываем цвета - группируем по значению и подсчитываем количество
        const colorsMap = new Map();
        colorsData.forEach((c: any) => {
            const name = c.displayName || c.value;
            if (colorsMap.has(name)) {
                colorsMap.set(name, colorsMap.get(name) + 1);
            } else {
                colorsMap.set(name, 1);
            }
        });
        const colors = Array.from(colorsMap.entries()).map(([name, count]) => ({ name, count }));

        // Обрабатываем бренды - группируем по имени и подсчитываем количество
        const brandsMap = new Map();
        brandsResult.forEach((b: any) => {
            if (brandsMap.has(b.name)) {
                brandsMap.set(b.name, brandsMap.get(b.name) + 1);
            } else {
                brandsMap.set(b.name, 1);
            }
        });
        const brandsList = Array.from(brandsMap.entries()).map(([name, count]) => ({ name, count }));

        return {
            sizes,
            colors,
            brands: brandsList,
            priceRange: {
                min: Number(priceData[0]?.minPrice || 0),
                max: Number(priceData[0]?.maxPrice || 0),
            },
            totalProducts: Number(totalProductsData[0]?.count || 0),
        };
    }); 