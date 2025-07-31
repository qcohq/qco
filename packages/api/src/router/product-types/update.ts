import { TRPCError } from "@trpc/server";
import { eq, ne, and } from "@qco/db";
import { z } from "zod";

import { productTypes } from "@qco/db/schema";
import { updateProductTypeSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const update = protectedProcedure
    .input(updateProductTypeSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;

        try {
            // Проверяем уникальность slug (исключая текущий тип продукта)
            if (updateData.slug) {
                const existingProductType = await ctx.db.query.productTypes.findFirst({
                    where: and(
                        eq(productTypes.slug, updateData.slug),
                        ne(productTypes.id, id)
                    ),
                });

                if (existingProductType) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Тип продукта с таким slug уже существует",
                    });
                }
            }

            // Обновляем тип продукта
            const [updatedProductType] = await ctx.db
                .update(productTypes)
                .set({
                    ...updateData,
                    updatedAt: new Date(),
                })
                .where(eq(productTypes.id, id))
                .returning();

            if (!updatedProductType) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Тип продукта не найден",
                });
            }

            return updatedProductType;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось обновить тип продукта",
                cause: error,
            });
        }
    }); 