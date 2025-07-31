import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { productVariantOptions } from "@qco/db/schema";
import { deleteVariantOptionSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const deleteOption = protectedProcedure
  .input(deleteVariantOptionSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование опции
      const option = await ctx.db.query.productVariantOptions.findFirst({
        where: eq(productVariantOptions.id, input.optionId),
      });

      if (!option) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Опция с ID ${input.optionId} не найдена`,
        });
      }

      // Удаляем опцию (каскадное удаление значений настроено в схеме)
      await ctx.db
        .delete(productVariantOptions)
        .where(eq(productVariantOptions.id, input.optionId));

      return { success: true, id: input.optionId };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось удалить опцию варианта",
        cause: error,
      });
    }
  }); 
