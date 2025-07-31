import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { productAttributeValues } from "@qco/db/schema";
import { eq } from "@qco/db";
import { deleteProductAttributeValueSchema } from "@qco/validators";

export const deleteValue = protectedProcedure
    .input(deleteProductAttributeValueSchema)
    .mutation(async ({ ctx, input }) => {
        const { id } = input;

        try {
            // Проверяем, что значение существует
            const existingValue = await ctx.db.query.productAttributeValues.findFirst({
                where: eq(productAttributeValues.id, id),
            });

            if (!existingValue) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Значение атрибута не найдено",
                });
            }

            // Удаляем значение
            await ctx.db
                .delete(productAttributeValues)
                .where(eq(productAttributeValues.id, id));

            return { success: true, id };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось удалить значение атрибута",
                cause: error,
            });
        }
    }); 