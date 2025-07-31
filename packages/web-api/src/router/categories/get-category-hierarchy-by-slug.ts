import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { z } from "zod";

const getCategoryHierarchyBySlugInputSchema = z.object({
    categorySlug: z.string(),
});

const categoryHierarchyItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});

const getCategoryHierarchyBySlugResponseSchema = z.array(categoryHierarchyItemSchema);

export const getCategoryHierarchyBySlug = publicProcedure
    .input(getCategoryHierarchyBySlugInputSchema)
    .output(getCategoryHierarchyBySlugResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { categorySlug } = input;

            // Получаем категорию по slug
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.slug, categorySlug),
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                    parentId: true,
                },
            });

            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Category with slug "${categorySlug}" not found`,
                });
            }

            // Получаем полную иерархию категорий
            const hierarchy: { id: string; name: string; slug: string }[] = [];
            let currentCategoryId = category.id;

            while (currentCategoryId) {
                const currentCategory = await ctx.db.query.categories.findFirst({
                    where: eq(categories.id, currentCategoryId),
                    columns: {
                        id: true,
                        name: true,
                        slug: true,
                        parentId: true,
                    },
                });

                if (!currentCategory) {
                    break;
                }

                // Добавляем категорию в начало массива (от корня к листу)
                hierarchy.unshift({
                    id: currentCategory.id,
                    name: currentCategory.name,
                    slug: currentCategory.slug,
                });

                // Переходим к родительской категории
                currentCategoryId = currentCategory.parentId || "";
            }

            return hierarchy;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch category hierarchy",
            });
        }
    }); 