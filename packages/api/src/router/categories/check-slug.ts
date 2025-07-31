import { TRPCError } from "@trpc/server";
import { eq, ne, and } from "@qco/db";
import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { checkSlugSchema } from "@qco/validators";

export const checkSlug = protectedProcedure
    .input(checkSlugSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { slug, excludeId } = input;

            // Проверяем, существует ли категория с таким slug
            const existingCategory = await ctx.db.query.categories.findFirst({
                where: excludeId
                    ? and(eq(categories.slug, slug), ne(categories.id, excludeId))
                    : eq(categories.slug, slug),
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                },
            });

            return {
                isAvailable: !existingCategory,
                existingCategory: existingCategory ? {
                    id: existingCategory.id,
                    name: existingCategory.name,
                    slug: existingCategory.slug,
                } : null,
            };
        } catch (error) {
            console.error("Ошибка при проверке уникальности URL категории:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Ошибка при проверке уникальности URL категории",
            });
        }
    }); 