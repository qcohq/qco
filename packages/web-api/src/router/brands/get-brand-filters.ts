import { z } from "zod";
import { eq } from "@qco/db";
import { brands, products } from "@qco/db/schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import { getBrandFiltersInputSchema, getBrandFiltersResponseSchema } from "@qco/web-validators";

export const getBrandFilters = publicProcedure
    .input(getBrandFiltersInputSchema)
    .output(getBrandFiltersResponseSchema)
    .query(async ({ ctx, input }) => {
        const { brandSlug } = input;

        // Получаем бренд по slug
        const brand = await ctx.db.query.brands.findFirst({
            where: eq(brands.slug, brandSlug),
        });

        if (!brand) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Бренд не найден",
            });
        }

        // Получаем все продукты бренда с их атрибутами
        const productsList = await ctx.db.query.products.findMany({
            where: eq(products.brandId, brand.id),
            with: {
                attributeValues: {
                    with: {
                        attribute: true,
                    },
                },
            },
        });

        if (productsList.length === 0) {
            return {
                sizes: [],
                colors: [],
                priceRange: { min: 0, max: 0 },
                totalProducts: 0,
                attributes: {},
            };
        }

        // Собираем уникальные размеры
        const sizes = new Map<string, number>();
        const colors = new Map<string, number>();
        const attributes = new Map<string, Map<string, number>>();
        let minPrice = Number.POSITIVE_INFINITY;
        let maxPrice = 0;

        for (const product of productsList) {
            // Обрабатываем размеры из атрибутов
            const sizeAttribute = product.attributeValues?.find(av =>
                av.attribute.slug === 'size' || av.attribute.name.toLowerCase().includes('размер')
            );
            if (sizeAttribute) {
                const sizeValue = sizeAttribute.value;
                if (sizeValue) {
                    sizes.set(sizeValue, (sizes.get(sizeValue) || 0) + 1);
                }
            }

            // Обрабатываем цвета из атрибутов
            const colorAttribute = product.attributeValues?.find(av =>
                av.attribute.slug === 'color' || av.attribute.name.toLowerCase().includes('цвет')
            );
            if (colorAttribute) {
                const colorValue = colorAttribute.value;
                if (colorValue) {
                    colors.set(colorValue, (colors.get(colorValue) || 0) + 1);
                }
            }

            // Обрабатываем цену
            const price = product.salePrice || product.basePrice;
            if (price && Number(price) > 0) {
                const priceNum = Number(price);
                minPrice = Math.min(minPrice, priceNum);
                maxPrice = Math.max(maxPrice, priceNum);
            }

            // Обрабатываем все атрибуты
            if (product.attributeValues) {
                for (const attributeValue of product.attributeValues) {
                    const attributeSlug = attributeValue.attribute.slug;
                    const attributeName = attributeValue.attribute.name;
                    const attributeValueStr = attributeValue.value;

                    if (!attributes.has(attributeSlug)) {
                        attributes.set(attributeSlug, new Map());
                    }

                    const attributeValues = attributes.get(attributeSlug)!;
                    const key = `${attributeName}:${attributeValueStr}`;
                    attributeValues.set(key, (attributeValues.get(key) || 0) + 1);
                }
            }
        }

        // Преобразуем размеры в массив
        const sizesArray = Array.from(sizes.entries()).map(([name, count]) => ({
            name,
            count,
        }));

        // Преобразуем цвета в массив
        const colorsArray = Array.from(colors.entries()).map(([name, count]) => ({
            name,
            count,
        }));

        // Преобразуем атрибуты в объект
        const attributesObject: Record<string, { name: string; values: Array<{ name: string; count: number }> }> = {};
        for (const [attributeSlug, values] of attributes.entries()) {
            // Получаем название атрибута из первого продукта, который имеет этот атрибут
            const attributeName = productsList
                .flatMap(p => p.attributeValues || [])
                .find(av => av.attribute.slug === attributeSlug)?.attribute.name || attributeSlug;

            attributesObject[attributeSlug] = {
                name: attributeName,
                values: Array.from(values.entries()).map(([name, count]) => ({
                    name,
                    count,
                })),
            };
        }

        return {
            sizes: sizesArray,
            colors: colorsArray,
            priceRange: {
                min: minPrice === Number.POSITIVE_INFINITY ? 0 : minPrice,
                max: maxPrice,
            },
            totalProducts: productsList.length,
            attributes: attributesObject,
        };
    }); 