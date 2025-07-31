import { publicProcedure } from "../../trpc";
import { eq, inArray, and, sql, gte, lte } from "@qco/db";
import {
    products,
    productCategories,
    categories,
    brands,
    productAttributeValues,
    productTypeAttributes
} from "@qco/db/schema";
import {
    getCategoryFiltersResponseSchema
} from "@qco/web-validators";
import { z } from "zod";

// Схема входных данных для динамических фильтров
const getDynamicCategoryFiltersSchema = z.object({
    categorySlug: z.string(),
    // Текущие фильтры, которые уже применены
    appliedFilters: z.object({
        brands: z.array(z.string()).optional(),
        priceRange: z.tuple([z.number(), z.number()]).optional(),
        sizes: z.array(z.string()).optional(),
        colors: z.array(z.string()).optional(),
        inStock: z.boolean().optional(),
        onSale: z.boolean().optional(),
        attributes: z.record(z.string(), z.array(z.string())).optional(),
    }).optional(),
});

export const getDynamicCategoryFilters = publicProcedure
    .input(getDynamicCategoryFiltersSchema)
    .output(getCategoryFiltersResponseSchema)
    .query(async ({ ctx, input }) => {
        const { categorySlug, appliedFilters } = input;

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
                    totalProducts: 0,
                    attributes: {}
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

        let productIds = productCategoryIds.map((pc: any) => pc.productId);

        // Если нет продуктов в категориях, получаем все активные продукты для "all"
        if (productIds.length === 0 && categorySlug === "all") {
            const allProducts = await ctx.db
                .select({ id: products.id })
                .from(products)
                .where(eq(products.isActive, true));
            productIds = allProducts.map(p => p.id);
        }

        // Функция для получения отфильтрованных продуктов
        const getFilteredProductIds = async (excludeFilter?: string) => {
            if (!appliedFilters || Object.keys(appliedFilters).length === 0) {
                return productIds;
            }

            let filteredIds = [...productIds];
            const conditions = [inArray(products.id, filteredIds), eq(products.isActive, true)];

            // Применяем фильтры, исключая один указанный
            if (excludeFilter !== 'brands' && appliedFilters.brands && appliedFilters.brands.length > 0) {
                const brandConditions = await ctx.db
                    .select({ productId: products.id })
                    .from(products)
                    .leftJoin(brands, eq(products.brandId, brands.id))
                    .where(
                        and(
                            inArray(products.id, filteredIds),
                            inArray(brands.slug, appliedFilters.brands)
                        )
                    );
                filteredIds = brandConditions.map(b => b.productId);
            }

            if (excludeFilter !== 'priceRange' && appliedFilters.priceRange) {
                const [min, max] = appliedFilters.priceRange;
                const priceCondition = and(
                    gte(products.basePrice, min.toString()),
                    lte(products.basePrice, max.toString())
                );
                if (priceCondition) {
                    conditions.push(priceCondition);
                }
            }

            if (excludeFilter !== 'inStock' && appliedFilters.inStock) {
                conditions.push(sql`${products.stock} > 0`);
            }

            if (excludeFilter !== 'onSale' && appliedFilters.onSale) {
                conditions.push(sql`${products.salePrice} IS NOT NULL AND ${products.salePrice} < ${products.basePrice}`);
            }

            // Применяем фильтры по атрибутам
            if (excludeFilter !== 'attributes' && appliedFilters.attributes) {
                for (const [attributeSlug, values] of Object.entries(appliedFilters.attributes)) {
                    if (Array.isArray(values) && values.length > 0) {
                        const attributeProducts = await ctx.db
                            .select({ productId: productAttributeValues.productId })
                            .from(productAttributeValues)
                            .leftJoin(productTypeAttributes, eq(productAttributeValues.attributeId, productTypeAttributes.id))
                            .where(
                                and(
                                    inArray(productAttributeValues.productId, filteredIds),
                                    eq(productTypeAttributes.slug, attributeSlug),
                                    inArray(productAttributeValues.value, values as string[])
                                )
                            );
                        filteredIds = attributeProducts.map(p => p.productId);
                    }
                }
            }

            // Получаем финальный список продуктов
            const finalProducts = await ctx.db.query.products.findMany({
                where: and(...conditions),
                columns: { id: true }
            });

            return finalProducts.map(p => p.id);
        };

        // Получаем доступные бренды (исключая фильтр по брендам)
        const availableForBrands = await getFilteredProductIds('brands');
        const brandsQuery = await ctx.db
            .select({
                name: brands.name,
                slug: brands.slug,
                count: sql<number>`COUNT(DISTINCT ${products.id})`.as('count')
            })
            .from(products)
            .leftJoin(brands, eq(products.brandId, brands.id))
            .where(
                and(
                    inArray(products.id, availableForBrands),
                    eq(products.isActive, true)
                )
            )
            .groupBy(brands.id, brands.name, brands.slug)
            .having(sql`COUNT(DISTINCT ${products.id}) > 0`);

        // Получаем ценовой диапазон (исключая фильтр по цене)
        const availableForPrice = await getFilteredProductIds('priceRange');
        const priceRangeQuery = await ctx.db
            .select({
                min: sql<number>`MIN(${products.basePrice})`.as('min'),
                max: sql<number>`MAX(${products.basePrice})`.as('max')
            })
            .from(products)
            .where(
                and(
                    inArray(products.id, availableForPrice),
                    eq(products.isActive, true)
                )
            );

        // Получаем доступные атрибуты
        const availableForAttributes = await getFilteredProductIds('attributes');
        const attributesQuery = await ctx.db
            .select({
                attributeSlug: productTypeAttributes.slug,
                attributeName: productTypeAttributes.name,
                value: productAttributeValues.value,
                count: sql<number>`COUNT(DISTINCT ${productAttributeValues.productId})`.as('count')
            })
            .from(productAttributeValues)
            .leftJoin(productTypeAttributes, eq(productAttributeValues.attributeId, productTypeAttributes.id))
            .where(
                and(
                    inArray(productAttributeValues.productId, availableForAttributes)
                )
            )
            .groupBy(productTypeAttributes.slug, productTypeAttributes.name, productAttributeValues.value)
            .having(sql`COUNT(DISTINCT ${productAttributeValues.productId}) > 0`);

        // Получаем общее количество товаров
        const totalProductsQuery = await ctx.db
            .select({
                count: sql<number>`COUNT(DISTINCT ${products.id})`.as('count')
            })
            .from(products)
            .where(
                and(
                    inArray(products.id, await getFilteredProductIds()),
                    eq(products.isActive, true)
                )
            );

        // Формируем атрибуты
        const attributes: Record<string, { name: string; values: { name: string; count: number }[] }> = {};

        for (const attr of attributesQuery) {
            if (attr.attributeSlug && !attributes[attr.attributeSlug]) {
                attributes[attr.attributeSlug] = {
                    name: attr.attributeName || '',
                    values: []
                };
            }
            if (attr.attributeSlug && attributes[attr.attributeSlug]) {
                const attribute = attributes[attr.attributeSlug];
                if (attribute) {
                    attribute.values.push({
                        name: attr.value,
                        count: Number(attr.count)
                    });
                }
            }
        }

        return {
            sizes: [], // TODO: Implement sizes logic if needed
            colors: [], // TODO: Implement colors logic if needed
            brands: brandsQuery
                .filter(b => b.name !== null)
                .map(b => ({
                    name: b.name!,
                    count: Number(b.count)
                })),
            priceRange: {
                min: Number(priceRangeQuery[0]?.min) || 0,
                max: Number(priceRangeQuery[0]?.max) || 0
            },
            totalProducts: Number(totalProductsQuery[0]?.count) || 0,
            attributes
        };
    }); 