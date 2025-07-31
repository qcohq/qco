import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { productVariantOptions, productVariantOptionValues } from "@qco/db/schema";
import { addVariantOptionValueSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const addOptionValue = protectedProcedure
  .input(addVariantOptionValueSchema)
  .mutation(async ({ ctx, input }) => {
    const { optionId, value, displayName, metadata } = input;

    // Проверяем, что опция существует
    const option = await ctx.db.query.productVariantOptions.findFirst({
      where: eq(productVariantOptions.id, optionId),
    });

    if (!option) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Опция не найдена",
      });
    }

    // Проверяем, что значение не существует для данной опции
    const existingValue = await ctx.db.query.productVariantOptionValues.findFirst({
      where: (table, { eq, and }) => and(
        eq(table.optionId, optionId),
        eq(table.value, value)
      ),
    });

    if (existingValue) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Значение уже существует для данной опции",
      });
    }

    // Получаем максимальный порядок сортировки для новой позиции
    const maxSortOrder = await ctx.db.query.productVariantOptionValues.findFirst({
      where: eq(productVariantOptionValues.optionId, optionId),
      orderBy: (fields, { desc }) => [desc(fields.sortOrder)],
    });

    const nextSortOrder = (maxSortOrder?.sortOrder || 0) + 1;

    // Создаем новое значение опции
    const [optionValue] = await ctx.db.insert(productVariantOptionValues).values({
      optionId,
      value,
      displayName: displayName || value,
      metadata,
      sortOrder: nextSortOrder,
    }).returning();

    return optionValue;
  });
