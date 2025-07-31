import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { products, productCategories, categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { z } from "zod";

const getCategoryHierarchyInputSchema = z.object({
    productSlug: z.string(),
});

const categoryHierarchyItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});

const getCategoryHierarchyResponseSchema = z.array(categoryHierarchyItemSchema);

export const getCategoryHierarchy = publicProcedure
    .input(getCategoryHierarchyInputSchema)
    .output(getCategoryHierarchyResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { productSlug } = input;

            // Получаем продукт по slug
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.slug, productSlug),
                columns: {
                    id: true,
                },
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Product with slug "${productSlug}" not found`,
                });
            }

            // Получаем категории продукта
            const productCategoriesData = await ctx.db
                .select({
                    categoryId: productCategories.categoryId,
                })
                .from(productCategories)
                .where(eq(productCategories.productId, product.id));

            if (productCategoriesData.length === 0) {
                return [];
            }

            // Берем первую категорию как основную
            const mainCategoryId = productCategoriesData[0]!.categoryId;

            // Получаем полную иерархию категорий
            const hierarchy: { id: string; name: string; slug: string }[] = [];
            let currentCategoryId = mainCategoryId;

            while (currentCategoryId) {
                const category = await ctx.db.query.categories.findFirst({
                    where: eq(categories.id, currentCategoryId),
                    columns: {
                        id: true,
                        name: true,
                        slug: true,
                        parentId: true,
                    },
                });

                if (!category) {
                    break;
                }

                // Добавляем категорию в начало массива (от корня к листу)
                hierarchy.unshift({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                });

                // Переходим к родительской категории
                currentCategoryId = category.parentId || "";
            }

            return hierarchy;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch product category hierarchy",
            });
        }
    }); 