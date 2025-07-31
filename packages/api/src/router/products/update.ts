import { TRPCError } from "@trpc/server";
import { eq, count } from "@qco/db";

import { protectedProcedure } from "../../trpc";
import { products, productCategories } from "@qco/db/schema";
import { productUpdateSchema } from "@qco/validators";
import { getAllCategoriesWithParents, extractCategoryIds, recalculateCategoryProductsCount } from "../../lib/category-utils";

export const update = protectedProcedure
  .input(productUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Идентификатор товара не указан",
      });
    }

    try {
      // Извлекаем категории из входных данных
      const { categories, ...productInput } = input;

      // Подготавливаем данные для обновления продукта
      const updateData = {
        ...productInput,
        // Обновляем updatedAt при каждом изменении
        updatedAt: new Date(),
      };

      // Используем транзакцию для обновления товара и его категорий
      return await ctx.db.transaction(async (tx: any) => {
        // Обновление самого товара
        const [updated] = await tx
          .update(products)
          .set(updateData)
          .where(eq(products.id, input.id))
          .returning();

        if (!updated) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Товар не обновлен",
          });
        }

        // Получаем старые категории продукта для пересчета
        const oldCategories = await tx
          .select({ categoryId: productCategories.categoryId })
          .from(productCategories)
          .where(eq(productCategories.productId, input.id));

        const oldCategoryIds = oldCategories.map((c: any) => c.categoryId);

        // Обновление категорий товара, если они были переданы
        if (categories && categories.length > 0) {
          // Получаем ID категорий (если переданы объекты, извлекаем id)
          const categoryIds = extractCategoryIds(categories);

          // Получаем все категории включая родительские
          const allCategoryIds = await getAllCategoriesWithParents(tx, categoryIds);

          // Сначала удаляем все существующие связи с категориями
          await tx
            .delete(productCategories)
            .where(eq(productCategories.productId, input.id));

          // Затем добавляем новые связи (включая родительские категории)
          await Promise.all(
            allCategoryIds.map((categoryId: string) =>
              tx.insert(productCategories).values({
                productId: input.id,
                categoryId: categoryId,
              }),
            ),
          );

          // Пересчитываем productsCount для всех затронутых категорий
          const allAffectedCategoryIds = [...new Set([...oldCategoryIds, ...allCategoryIds])];
          await recalculateCategoryProductsCount(tx, allAffectedCategoryIds);
        } else if (categories && categories.length === 0) {
          // Если передан пустой массив категорий, удаляем все существующие связи
          await tx
            .delete(productCategories)
            .where(eq(productCategories.productId, input.id));

          // Пересчитываем productsCount для старых категорий
          if (oldCategoryIds.length > 0) {
            await recalculateCategoryProductsCount(tx, oldCategoryIds);
          }
        }

        // Возвращаем подготовленные данные для фронтенда
        return {
          id: updated.id,
          name: updated.name,
          slug: updated.slug,
          description: updated.description,
          isActive: updated.isActive,
          isFeatured: updated.isFeatured,
          isPopular: updated.isPopular,
          isNew: updated.isNew,
          brandId: updated.brandId,
          stock: updated.stock,
          basePrice: updated.basePrice ? Number(updated.basePrice) : null,
          salePrice: updated.salePrice ? Number(updated.salePrice) : null,
          discountPercent: updated.discountPercent,
          hasVariants: updated.hasVariants,
          sku: updated.sku,
          seoTitle: updated.seoTitle,
          seoUrl: updated.seoUrl,
          seoDescription: updated.seoDescription,
          seoKeywords: updated.seoKeywords,
          productTypeId: updated.productTypeId,
          xmlId: updated.xmlId,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        };
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      // Анализируем ошибку базы данных для более понятных сообщений
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Проверяем на нарушение внешнего ключа (brandId)
      if (errorMessage.includes("foreign key") && errorMessage.includes("brand_id")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Выбранный бренд не существует. Пожалуйста, выберите другой бренд.",
        });
      }

      // Проверяем на нарушение внешнего ключа (productTypeId)
      if (errorMessage.includes("foreign key") && errorMessage.includes("product_type_id")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Выбранный тип продукта не существует. Пожалуйста, выберите другой тип продукта.",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Ошибка обновления товара: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
