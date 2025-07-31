import { TRPCError } from "@trpc/server";
import { eq, ne, and } from "@qco/db";
import { products } from "@qco/db/schema";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

const checkSlugSchema = z.object({
    slug: z.string().min(1, "URL товара обязателен"),
    excludeId: z.string().optional(), // ID товара для исключения при редактировании
});

export const checkSlug = protectedProcedure
    .input(checkSlugSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { slug, excludeId } = input;

            // Проверяем, существует ли товар с таким slug
            const existingProduct = await ctx.db.query.products.findFirst({
                where: excludeId
                    ? and(eq(products.slug, slug), ne(products.id, excludeId))
                    : eq(products.slug, slug),
                columns: {
                    id: true,
                    name: true,
                    slug: true,
                },
            });

            return {
                isAvailable: !existingProduct,
                existingProduct: existingProduct ? {
                    id: existingProduct.id,
                    name: existingProduct.name,
                    slug: existingProduct.slug,
                } : null,
            };
        } catch (error) {

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Ошибка при проверке уникальности URL товара",
            });
        }
    }); 
