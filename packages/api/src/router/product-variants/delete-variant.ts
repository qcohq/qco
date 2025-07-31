import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { productVariants } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const deleteVariant = protectedProcedure
  .input(
    z.object({
      variantId: z.string(),
      productId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование варианта
      const variant = await ctx.db.query.productVariants.findFirst({
        where: and(
          eq(productVariants.id, input.variantId),
          eq(productVariants.productId, input.productId),
        ),
      });

      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Вариант с ID ${input.variantId} не найден`,
        });
      }

      // Удаляем вариант (каскадное удаление цен и связей с атрибутами настроено в схеме)
      await ctx.db
        .delete(productVariants)
        .where(eq(productVariants.id, input.variantId));

      return { success: true, id: input.variantId };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось удалить вариант продукта",
        cause: error,
      });
    }
  }); 
