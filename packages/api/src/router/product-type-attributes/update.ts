import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { updateProductTypeAttributeSchema } from "@qco/validators";
import { productTypeAttributes, productTypes } from "@qco/db/schema";
import { eq, and, ne } from "@qco/db";

export const update = protectedProcedure
    .input(updateProductTypeAttributeSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;

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

        // Если обновляется slug, проверяем уникальность в рамках типа продукта
        if (updateData.slug && updateData.slug !== existingAttribute.slug) {
            const productTypeId = updateData.productTypeId || existingAttribute.productTypeId;
            const duplicateSlug = await ctx.db.query.productTypeAttributes.findFirst({
                where: and(
                    eq(productTypeAttributes.slug, updateData.slug),
                    eq(productTypeAttributes.productTypeId, productTypeId),
                    ne(productTypeAttributes.id, id)
                ),
            });

            if (duplicateSlug) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Атрибут с таким slug уже существует в данном типе продукта",
                });
            }
        }

        // Если обновляется productTypeId, проверяем существование типа продукта
        if (updateData.productTypeId) {
            const productType = await ctx.db.query.productTypes.findFirst({
                where: eq(productTypes.id, updateData.productTypeId),
            });

            if (!productType) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Тип продукта не найден",
                });
            }
        }

        // Подготавливаем данные для обновления
        const updateValues = {
            ...updateData,
            updatedAt: new Date(),
        };

        // Обрабатываем options отдельно
        if (updateData.options !== undefined) {
            updateValues.options = Array.isArray(updateData.options) ? updateData.options : [];
        }

        // Обновляем атрибут
        const [updatedAttribute] = await ctx.db
            .update(productTypeAttributes)
            .set(updateValues)
            .where(eq(productTypeAttributes.id, id))
            .returning();

        return updatedAttribute;
    });