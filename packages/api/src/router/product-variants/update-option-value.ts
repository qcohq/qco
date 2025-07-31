import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { productVariantOptionValues } from "@qco/db/schema";
import { updateVariantOptionValueSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const updateOptionValue = protectedProcedure
  .input(updateVariantOptionValueSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, value, displayName, metadata, sortOrder } = input;

    // Проверяем существование значения опции
    const existingValue = await ctx.db.query.productVariantOptionValues.findFirst({
      where: eq(productVariantOptionValues.id, id),
    });

    if (!existingValue) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Значение опции не найдено",
      });
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (value !== undefined) {
      updateData.value = value;
    }

    if (displayName !== undefined) {
      updateData.displayName = displayName;
    }

    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder;
    }

    // Обновляем значение опции
    const [updatedValue] = await ctx.db
      .update(productVariantOptionValues)
      .set(updateData)
      .where(eq(productVariantOptionValues.id, id))
      .returning();

    if (!updatedValue) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось обновить значение опции",
      });
    }

    return updatedValue;
  }); 
