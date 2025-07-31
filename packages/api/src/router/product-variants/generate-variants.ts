import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  productVariants,
  products,
  productVariantOptions,
  productVariantOptionValues,
  productVariantOptionCombinations
} from "@qco/db/schema";
import { generateVariantsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const generateVariants = protectedProcedure
  .input(generateVariantsSchema)
  .mutation(async ({ ctx, input }) => {
    const { productId, optionIds } = input;

    // Проверяем существование продукта
    const product = await ctx.db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Продукт не найден",
      });
    }

    // Получаем выбранные опции вариантов с их значениями
    const options = await ctx.db.query.productVariantOptions.findMany({
      where: (table, { inArray }) => inArray(table.id, optionIds),
      with: {
        values: {
          orderBy: (fields, { asc }) => [asc(fields.sortOrder)],
        },
      },
    });

    if (options.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Не найдены опции для генерации вариантов",
      });
    }

    // Проверяем, что все опции принадлежат данному продукту
    const invalidOptions = options.filter(option => option.productId !== productId);
    if (invalidOptions.length > 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Некоторые опции не принадлежат данному продукту",
      });
    }

    // Генерируем все возможные комбинации значений опций
    const generateCombinations = (
      optionsList: typeof options,
      currentIndex = 0,
      currentCombination: { optionId: string; valueId: string; optionName: string; valueName: string }[] = []
    ): { optionId: string; valueId: string; optionName: string; valueName: string }[][] => {
      if (currentIndex >= optionsList.length) {
        return [currentCombination];
      }

      const option = optionsList[currentIndex];
      if (!option || option.values.length === 0) {
        return generateCombinations(optionsList, currentIndex + 1, currentCombination);
      }

      const combinations: { optionId: string; valueId: string; optionName: string; valueName: string }[][] = [];

      for (const value of option.values) {
        const newCombination = [
          ...currentCombination,
          {
            optionId: option.id,
            valueId: value.id,
            optionName: option.name,
            valueName: value.displayName,
          },
        ];
        combinations.push(...generateCombinations(optionsList, currentIndex + 1, newCombination));
      }

      return combinations;
    };

    const combinations = generateCombinations(options);

    if (combinations.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Не удалось создать комбинации из выбранных опций",
      });
    }

    // Создаем варианты для каждой комбинации
    const createdVariants = [];

    for (const combination of combinations) {
      // Генерируем название варианта
      const variantName = `${product.name} - ${combination.map(c => c.valueName).join(" / ")}`;

      // Генерируем SKU
      const skuSuffix = combination.map(c => c.valueName.substring(0, 3).toUpperCase()).join("-");
      const variantSku = product.sku ? `${product.sku}-${skuSuffix}` : `VAR-${skuSuffix}`;

      // Создаем вариант
      const [variant] = await ctx.db
        .insert(productVariants)
        .values({
          name: variantName,
          productId,
          sku: variantSku,
          barcode: null,
          price: product.basePrice?.toString() || "0",
          salePrice: product.salePrice?.toString() || null,
          costPrice: null, // По умолчанию null для новых вариантов
          stock: 0,
          minStock: 0,
          weight: null,
          width: null,
          height: null,
          depth: null,
          isActive: true,
          isDefault: false,
        })
        .returning();

      if (!variant) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать вариант",
        });
      }

      // Создаем связи варианта с опциями
      for (const combo of combination) {
        await ctx.db.insert(productVariantOptionCombinations).values({
          variantId: variant.id,
          optionId: combo.optionId,
          optionValueId: combo.valueId,
        });
      }

      createdVariants.push(variant);
    }

    return {
      count: createdVariants.length,
      variants: createdVariants,
      message: `Успешно создано ${createdVariants.length} вариантов`,
    };
  });
