import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { products, productFiles, productCategories, orderItems } from "@qco/db/schema";

import { protectedProcedure } from "../../trpc";
import { recalculateCategoryProductsCount } from "../../lib/category-utils";

export const deleteProduct = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем, есть ли товар в заказах
      const productInOrders = await ctx.db
        .select({ productId: orderItems.productId })
        .from(orderItems)
        .where(eq(orderItems.productId, input.id));

      if (productInOrders.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Невозможно удалить товар, который используется в заказах",
        });
      }

      // Получаем все файлы, связанные с продуктом
      const productFilesList = await ctx.db.query.productFiles.findMany({
        where: eq(productFiles.productId, input.id),
        with: {
          file: true,
        },
      });

      // Удаляем файлы из S3
      if (productFilesList.length > 0) {
        const { deleteFile } = await import("@qco/lib");

        for (const productFile of productFilesList) {
          try {
            if (productFile.file?.path) {
              await deleteFile(productFile.file.path);
            }
          } catch (e) {
            // Не прерываем удаление продукта, если файл не найден в S3
            console.warn(`Failed to delete file from S3: ${productFile.file?.path}`, e);
          }
        }
      }

      // Получаем категории продукта перед удалением для пересчета
      const productCategoriesList = await ctx.db
        .select({ categoryId: productCategories.categoryId })
        .from(productCategories)
        .where(eq(productCategories.productId, input.id));

      const categoryIds = productCategoriesList.map((c: any) => c.categoryId);

      // Удаляем сам продукт - связанные записи удалятся автоматически благодаря каскадным удалениям
      await ctx.db.delete(products).where(eq(products.id, input.id));

      // Пересчитываем productsCount для категорий, из которых был удален продукт
      if (categoryIds.length > 0) {
        await recalculateCategoryProductsCount(ctx.db, categoryIds);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Ошибка при удалении товара:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Неизвестная ошибка при удалении товара",
      });
    }
  });
