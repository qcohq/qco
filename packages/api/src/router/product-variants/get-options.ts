import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { z } from "zod";

import { productVariantOptions } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getOptions = protectedProcedure
  .input(
    z.object({
      productId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      // Получаем все опции вариантов для продукта с их значениями
      const options = await ctx.db.query.productVariantOptions.findMany({
        where: eq(productVariantOptions.productId, input.productId),
        with: {
          values: {
            orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.displayName)],
          },
        },
        orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
      });

      // Форматируем данные для удобства использования на фронтенде
      return options.map(option => ({
        id: option.id,
        name: option.name,
        slug: option.slug,
        type: option.type,
        metadata: option.metadata,
        sortOrder: option.sortOrder,
        values: option.values.map(value => ({
          id: value.id,
          value: value.value,
          displayName: value.displayName,
          metadata: value.metadata,
          sortOrder: value.sortOrder,
        })),
        createdAt: option.createdAt,
        updatedAt: option.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось получить опции продукта",
        cause: error,
      });
    }
  });
