import { TRPCError } from "@trpc/server";
import { inArray } from "drizzle-orm";
import { z } from "zod";

import { products, productFiles, productCategories, orderItems } from "@qco/db/schema";

import { protectedProcedure } from "../../trpc";
import { recalculateCategoryProductsCount } from "../../lib/category-utils";

export const bulkDelete = protectedProcedure
  .input(
    z.object({
      ids: z.array(z.string()),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      if (!input.ids.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не указаны ID товаров для удаления",
        });
      }

      console.log(`Начинаем массовое удаление ${input.ids.length} товаров`);

      // Проверяем, есть ли товары в заказах
      const productsInOrders = await ctx.db
        .select({ productId: orderItems.productId })
        .from(orderItems)
        .where(inArray(orderItems.productId, input.ids));

      if (productsInOrders.length > 0) {
        const productIdsInOrders = [...new Set(productsInOrders.map(p => p.productId))];
        console.log(`Найдены товары в заказах: ${productIdsInOrders.join(", ")}`);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Невозможно удалить товары, которые используются в заказах: ${productIdsInOrders.join(", ")}`,
        });
      }

      console.log("Проверка товаров в заказах пройдена успешно");

      // Получаем все файлы, связанные с продуктами для удаления из S3
      const productFilesList = await ctx.db.query.productFiles.findMany({
        where: inArray(productFiles.productId, input.ids),
        with: {
          file: true,
        },
      });

      console.log(`Найдено ${productFilesList.length} файлов для удаления из S3`);

      // Удаляем файлы из S3
      if (productFilesList.length > 0) {
        const { deleteFile } = await import("@qco/lib");

        for (const productFile of productFilesList) {
          try {
            if (productFile.file?.path) {
              await deleteFile(productFile.file.path);
              console.log(`Файл удален из S3: ${productFile.file.path}`);
            }
          } catch (e) {
            // Не прерываем удаление продуктов, если файл не найден в S3
            console.warn(`Failed to delete file from S3: ${productFile.file?.path}`, e);
          }
        }
      }

      // Получаем категории продуктов перед удалением для пересчета
      const productCategoriesList = await ctx.db
        .select({ categoryId: productCategories.categoryId })
        .from(productCategories)
        .where(inArray(productCategories.productId, input.ids));

      const categoryIds = [...new Set(productCategoriesList.map((c: any) => c.categoryId))];

      console.log(`Найдено ${categoryIds.length} категорий для пересчета`);

      // Удаляем продукты - связанные записи удалятся автоматически благодаря каскадным удалениям
      const result = await ctx.db
        .delete(products)
        .where(inArray(products.id, input.ids))
        .returning({ id: products.id });

      console.log(`Успешно удалено ${result.length} товаров`);

      // Пересчитываем productsCount для всех затронутых категорий
      if (categoryIds.length > 0) {
        await recalculateCategoryProductsCount(ctx.db, categoryIds);
        console.log(`Пересчитано количество товаров для ${categoryIds.length} категорий`);
      }

      return {
        success: true,
        deletedCount: result.length,
        message: `Успешно удалено ${result.length} товаров`,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Ошибка при массовом удалении товаров:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Неизвестная ошибка при удалении товаров",
      });
    }
  });
