import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { products, productVariants } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const updateStock = protectedProcedure
    .input(
        z.object({
            productId: z.string(),
            stock: z.number().min(0),
            minStock: z.number().min(0).optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        try {
            // Проверяем существование продукта
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.id, input.productId),
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Товар с ID ${input.productId} не найден`,
                });
            }

            // Получаем все варианты товара
            const variants = await ctx.db.query.productVariants.findMany({
                where: eq(productVariants.productId, input.productId),
            });

            // Обновляем наличие для всех вариантов
            for (const variant of variants) {
                await ctx.db
                    .update(productVariants)
                    .set({
                        stock: input.stock,
                        minStock: input.minStock,
                        updatedAt: new Date(),
                    })
                    .where(eq(productVariants.id, variant.id));
            }

            return { success: true, count: variants.length };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось обновить наличие вариантов",
                cause: error,
            });
        }
    }); 
