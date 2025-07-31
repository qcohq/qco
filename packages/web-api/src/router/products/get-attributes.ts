import { TRPCError } from "@trpc/server";
import { eq, and } from "@qco/db";
import {
    products,
    productAttributeValues,
    productTypeAttributes,
    productTypes
} from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import {
    getProductAttributesInputSchema,
    getProductAttributesResponseSchema
} from "@qco/web-validators";

export const getAttributes = publicProcedure
    .input(getProductAttributesInputSchema)
    .output(getProductAttributesResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { slug } = input;

            // Получаем продукт по slug
            const product = await ctx.db.query.products.findFirst({
                where: and(
                    eq(products.slug, slug),
                    eq(products.isActive, true),
                ),
                columns: {
                    id: true,
                    productTypeId: true,
                },
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Product with slug "${slug}" not found`,
                });
            }

            // Если у продукта нет типа, возвращаем пустой массив
            if (!product.productTypeId) {
                return [];
            }

            // Получаем атрибуты типа продукта и их значения для данного продукта
            const productAttributes = await ctx.db.query.productAttributeValues.findMany({
                where: eq(productAttributeValues.productId, product.id),
                with: {
                    attribute: {
                        columns: {
                            id: true,
                            name: true,
                            slug: true,
                            type: true,
                            options: true,
                            sortOrder: true,
                        },
                    },
                },
            });

            // Сортируем атрибуты по sortOrder
            productAttributes.sort((a, b) => (a.attribute.sortOrder || 0) - (b.attribute.sortOrder || 0));

            // Форматируем результат
            const formattedAttributes = productAttributes.map((attr) => ({
                id: attr.attribute.id,
                name: attr.attribute.name,
                slug: attr.attribute.slug,
                type: attr.attribute.type,
                value: attr.value,
                options: attr.attribute.options || [],
            }));

            return formattedAttributes;
        } catch (error) {
            console.error("Error fetching product attributes:", error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch product attributes",
                cause: error,
            });
        }
    }); 