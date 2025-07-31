import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { productAttributeValues, productTypeAttributes } from "@qco/db/schema";
import { eq, and } from "@qco/db";
import { upsertProductAttributeValueSchema } from "@qco/validators";

export const upsert = protectedProcedure
    .input(upsertProductAttributeValueSchema)
    .mutation(async ({ ctx, input }) => {
        const { productId, attributeId, value } = input;

        try {
            // Проверяем, что атрибут существует
            const attribute = await ctx.db.query.productTypeAttributes.findFirst({
                where: eq(productTypeAttributes.id, attributeId),
            });

            if (!attribute) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Атрибут не найден",
                });
            }

            // Проверяем, существует ли уже значение для этого продукта и атрибута
            const existingValue = await ctx.db.query.productAttributeValues.findFirst({
                where: and(
                    eq(productAttributeValues.productId, productId),
                    eq(productAttributeValues.attributeId, attributeId)
                ),
            });

            let result: typeof productAttributeValues.$inferSelect;
            if (existingValue) {
                // Обновляем существующее значение
                [result] = await ctx.db
                    .update(productAttributeValues)
                    .set({
                        value,
                        updatedAt: new Date(),
                    })
                    .where(eq(productAttributeValues.id, existingValue.id))
                    .returning();
            } else {
                // Создаем новое значение
                [result] = await ctx.db
                    .insert(productAttributeValues)
                    .values({
                        productId,
                        attributeId,
                        value,
                    })
                    .returning();
            }

            return result;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось сохранить значение атрибута",
                cause: error,
            });
        }
    }); 