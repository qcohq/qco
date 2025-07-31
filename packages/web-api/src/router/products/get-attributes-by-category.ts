import { TRPCError } from "@trpc/server";
import { eq, and, inArray } from "@qco/db";
import {
    categories,
    categoryProductTypes,
    productTypeAttributes,
    productTypes
} from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import {
    getAttributesByCategoryInputSchema,
    getAttributesByCategoryResponseSchema
} from "@qco/web-validators";

export const getAttributesByCategory = publicProcedure
    .input(getAttributesByCategoryInputSchema)
    .output(getAttributesByCategoryResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { categorySlug } = input;

            // Получаем категорию по slug
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.slug, categorySlug),
                columns: {
                    id: true,
                },
            });

            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Category with slug "${categorySlug}" not found`,
                });
            }

            // Получаем все связанные типы продуктов для этой категории
            const categoryProductTypesData = await ctx.db.query.categoryProductTypes.findMany({
                where: eq(categoryProductTypes.categoryId, category.id),
                with: {
                    productType: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: (categoryProductTypes, { asc }) => [
                    asc(categoryProductTypes.sortOrder),
                    asc(categoryProductTypes.isPrimary),
                ],
            });

            if (categoryProductTypesData.length === 0) {
                return [];
            }

            // Получаем ID всех типов продуктов
            const productTypeIds = categoryProductTypesData.map(cpt => cpt.productTypeId);

            // Получаем все фильтруемые атрибуты для этих типов продуктов
            const attributes = await ctx.db.query.productTypeAttributes.findMany({
                where: and(
                    inArray(productTypeAttributes.productTypeId, productTypeIds),
                    eq(productTypeAttributes.isFilterable, true),
                    eq(productTypeAttributes.isActive, true),
                ),
                orderBy: (productTypeAttributes, { asc }) => [
                    asc(productTypeAttributes.sortOrder),
                    asc(productTypeAttributes.name),
                ],
            });

            return attributes.map(attr => ({
                id: attr.id,
                name: attr.name,
                slug: attr.slug,
                type: attr.type,
                options: attr.options || [],
                isFilterable: attr.isFilterable,
                sortOrder: attr.sortOrder,
                isRequired: attr.isRequired,
                isActive: attr.isActive,
            }));
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch attributes by category",
            });
        }
    }); 