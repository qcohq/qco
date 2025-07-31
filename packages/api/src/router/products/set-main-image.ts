import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { products, productFiles } from "@qco/db/schema";

import { protectedProcedure } from "../../trpc";

export const setMainImage = protectedProcedure
  .input(
    z.object({
      productId: z.string(),
      fileId: z.string(),
    }),
  )
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

      // 1. Снимаем тип 'main' со всех файлов этого продукта
      await ctx.db
        .update(productFiles)
        .set({ type: "gallery" })
        .where(
          and(
            eq(productFiles.productId, input.productId),
            eq(productFiles.type, "main"),
          ),
        );

      // 2. Ставим тип 'main' выбранному файлу
      const [updatedMain] = await ctx.db
        .update(productFiles)
        .set({ type: "main", order: 0 })
        .where(
          and(
            eq(productFiles.productId, input.productId),
            eq(productFiles.fileId, input.fileId),
          ),
        )
        .returning();

      if (!updatedMain) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Файл с ID ${input.fileId} не найден у товара`,
        });
      }

      return { ...product, mainImage: updatedMain };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Ошибка установки основного изображения: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
