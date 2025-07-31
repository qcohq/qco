import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { deleteProductTypeAttributeSchema } from "@qco/validators";
import { productTypeAttributes, productAttributeValues } from "@qco/db/schema";
import { eq } from "@qco/db";

export const deleteItem = protectedProcedure
    .input(deleteProductTypeAttributeSchema)
    .mutation(async ({ ctx, input }) => {
        const { id } = input;

        // Проверяем, что атрибут существует
        const existingAttribute = await ctx.db.query.productTypeAttributes.findFirst({
            where: eq(productTypeAttributes.id, id)
        });

        if (!existingAttribute) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Атрибут не найден",
            });
        }

        // Проверяем, есть ли продукты, использующие этот атрибут
        const productsWithAttribute = await ctx.db.query.productAttributeValues.findMany({
            where: eq(productAttributeValues.attributeId, id),
        });

        if (productsWithAttribute.length > 0) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Нельзя удалить атрибут, который используется в продуктах",
            });
        }

        // Удаляем атрибут
        await ctx.db
            .delete(productTypeAttributes)
            .where(eq(productTypeAttributes.id, id));

        return { success: true };
    });