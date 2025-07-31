import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { products, productVariants } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const setOutOfStock = protectedProcedure
    .input(
        z.object({
            productId: z.string(),
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

            // Обновляем остаток основного продукта
            await ctx.db
                .update(products)
                .set({
                    stock: 0,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, input.productId));

            // Получаем все варианты товара
            const variants = await ctx.db.query.productVariants.findMany({
                where: eq(productVariants.productId, input.productId),
            });

            // Обновляем остатки для всех вариантов
            for (const variant of variants) {
                await ctx.db
                    .update(productVariants)
                    .set({
                        stock: 0,
                        updatedAt: new Date(),
                    })
                    .where(eq(productVariants.id, variant.id));
            }

            return {
                success: true,
                productId: input.productId,
                variantsUpdated: variants.length
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось обнулить остатки товара",
                cause: error,
            });
        }
    }); 