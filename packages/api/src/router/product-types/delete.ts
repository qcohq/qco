import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { z } from "zod";

import { productTypes, products } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const deleteItem = protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        try {
            // Проверяем, есть ли продукты с этим типом
            const productsWithType = await ctx.db.query.products.findFirst({
                where: eq(products.productTypeId, input.id),
            });

            if (productsWithType) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Нельзя удалить тип продукта, который используется в товарах",
                });
            }

            // Удаляем тип продукта
            const [deletedProductType] = await ctx.db
                .delete(productTypes)
                .where(eq(productTypes.id, input.id))
                .returning();

            if (!deletedProductType) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Тип продукта не найден",
                });
            }

            return deletedProductType;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось удалить тип продукта",
                cause: error,
            });
        }
    });
