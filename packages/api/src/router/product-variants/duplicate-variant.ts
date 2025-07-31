import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import {
  products,
  productVariants,
  productVariantOptionCombinations,
} from "@qco/db/schema";
import { duplicateVariantSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const duplicateVariant = protectedProcedure
  .input(duplicateVariantSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование продукта
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Товар с ID ${input.productId} не найден`,
        });
      }

      // Получаем исходный вариант
      const originalVariant = await ctx.db.query.productVariants.findFirst({
        where: eq(productVariants.id, input.variantId),
      });

      if (!originalVariant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Вариант с ID ${input.variantId} не найден`,
        });
      }

      // Получаем опции исходного варианта
      const originalOptionCombinations = await ctx.db.query.productVariantOptionCombinations.findMany({
        where: eq(productVariantOptionCombinations.variantId, input.variantId),
      });

      // Создаем новый вариант
      const newVariant = await ctx.db
        .insert(productVariants)
        .values({
          name: `${originalVariant.name} (копия)`,
          productId: input.productId,
          sku: originalVariant.sku ? `${originalVariant.sku}-copy` : null,
          barcode: originalVariant.barcode,
          price: originalVariant.price,
          salePrice: originalVariant.salePrice,
          costPrice: originalVariant.costPrice,
          stock: originalVariant.stock,
          minStock: originalVariant.minStock,
          weight: originalVariant.weight,
          width: originalVariant.width,
          height: originalVariant.height,
          depth: originalVariant.depth,
          isActive: originalVariant.isActive,
          isDefault: false, // Копия не может быть вариантом по умолчанию
        })
        .returning()
        .then((res: (typeof productVariants.$inferSelect)[]) => res[0]);

      if (!newVariant) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать копию варианта",
        });
      }

      // Копируем опции варианта
      for (const combination of originalOptionCombinations) {
        await ctx.db.insert(productVariantOptionCombinations).values({
          variantId: newVariant.id,
          optionId: combination.optionId,
          optionValueId: combination.optionValueId,
        });
      }

      // Получаем полные данные нового варианта
      const result = await ctx.db.query.productVariants.findFirst({
        where: eq(productVariants.id, newVariant.id),
        with: {
          product: true,
        },
      });

      return result;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось скопировать вариант",
        cause: error,
      });
    }
  });
