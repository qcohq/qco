import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { productVariantOptions, productVariantOptionValues, products } from "@qco/db/schema";
import { createVariantOptionSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const createOption = protectedProcedure
  .input(createVariantOptionSchema)
  .mutation(async ({ ctx, input }) => {
    const { name, values, productId, type, metadata } = input;

    // Проверяем, что продукт существует
    const product = await ctx.db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Продукт не найден",
      });
    }

    // Проверяем, что опция с таким именем не существует для данного продукта
    const existingOption = await ctx.db.query.productVariantOptions.findFirst({
      where: (table, { eq, and }) => and(
        eq(table.productId, productId),
        eq(table.name, name)
      ),
    });

    if (existingOption) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Опция с таким названием уже существует",
      });
    }

    // Создаем опцию варианта
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [option] = await ctx.db.insert(productVariantOptions).values({
      productId,
      name,
      slug,
      type,
      metadata,
      sortOrder: 0,
    }).returning();

    if (!option) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось создать опцию",
      });
    }

    // Создаем значения опции
    const optionValues = await Promise.all(
      values.map(async (value, index) => {
        const [optionValue] = await ctx.db.insert(productVariantOptionValues).values({
          optionId: option.id,
          value,
          displayName: value,
          sortOrder: index,
        }).returning();
        return optionValue;
      })
    );

    return {
      option,
      values: optionValues,
    };
  });
