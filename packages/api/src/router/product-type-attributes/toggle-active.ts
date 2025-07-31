import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { productTypeAttributes } from "@qco/db/schema";
import { eq } from "@qco/db";
import { z } from "zod";

const toggleActiveSchema = z.object({
    id: z.string(),
    isActive: z.boolean(),
});

export const toggleActive = protectedProcedure
    .input(toggleActiveSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, isActive } = input;

        // Проверяем, что атрибут существует
        const existingAttribute = await ctx.db.query.productTypeAttributes.findFirst({
            where: eq(productTypeAttributes.id, id),
        });

        if (!existingAttribute) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Атрибут не найден",
            });
        }

        // Обновляем статус активности атрибута
        const [updatedAttribute] = await ctx.db
            .update(productTypeAttributes)
            .set({
                isActive,
                updatedAt: new Date(),
            })
            .where(eq(productTypeAttributes.id, id))
            .returning();

        return updatedAttribute;
    }); 