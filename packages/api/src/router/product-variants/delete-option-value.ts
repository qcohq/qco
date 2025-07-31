import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { productVariantOptionValues } from "@qco/db/schema";
import { deleteVariantOptionValueSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const deleteOptionValue = protectedProcedure
  .input(deleteVariantOptionValueSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование значения опции
      const value = await ctx.db.query.productVariantOptionValues.findFirst({
        where: eq(productVariantOptionValues.id, input.valueId),
      });

      if (!value) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Значение опции с ID ${input.valueId} не найдено`,
        });
      }

      // Удаляем значение опции
      await ctx.db
        .delete(productVariantOptionValues)
        .where(eq(productVariantOptionValues.id, input.valueId));

      return { success: true, id: input.valueId };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось удалить значение опции варианта",
        cause: error,
      });
    }
  }); 
