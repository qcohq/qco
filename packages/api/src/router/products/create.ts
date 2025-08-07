import { TRPCError } from "@trpc/server";
import { eq, } from "@qco/db";
import { protectedProcedure } from "../../trpc";
import { products, productCategories } from "@qco/db/schema";
import { productCreateSchema } from "@qco/validators";
import { getAllCategoriesWithParents, extractCategoryIds, recalculateCategoryProductsCount } from "../../lib/category-utils";
import { generateSlug, generateUniqueSlug } from "../../lib/slug-utils";


export const create = protectedProcedure
  .input(productCreateSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Генерируем слаг из названия, если он не указан
      let slug = input.slug;
      if (!slug) {
        const baseSlug = generateSlug(input.name);

        // Проверяем, что слаг уникален
        slug = await generateUniqueSlug(baseSlug, async (testSlug) => {
          const existingProduct = await ctx.db.query.products.findFirst({
            where: eq(products.slug, testSlug),
          });
          return !!existingProduct;
        });
      }

      // Подготавливаем данные для создания продукта
      const productValues = {
        name: input.name,
        slug,
        description: input.description ?? "",
        isActive: false,
        isFeatured: input.isFeatured ?? false,
        isPopular: input.isPopular ?? false,
        isNew: input.isNew ?? false,
        brandId: input.brandId ?? null,
        stock: input.stock ?? null,
        basePrice: input.basePrice ? String(input.basePrice) : null,
        salePrice: input.salePrice ? String(input.salePrice) : null,
        discountPercent: input.discountPercent ?? null,
        hasVariants: input.hasVariants ?? false,
        sku: input.sku ?? null,
        seoTitle: input.seoTitle ?? null,
        seoUrl: input.seoUrl ?? null,
        seoDescription: input.seoDescription ?? null,
        seoKeywords: input.seoKeywords ?? null,
        productTypeId: input.productTypeId,
        xmlId: input.xmlId ?? null,
      };

      // Используем транзакцию для создания продукта и его категорий
      return await ctx.db.transaction(async (tx) => {
        // Создаем продукт
        const [created] = await tx
          .insert(products)
          .values(productValues)
          .returning();

        if (!created) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Товар не был создан. Попробуйте еще раз.",
          });
        }

        // Добавляем категории, если они были переданы
        if (input.categories && input.categories.length > 0) {
          // Получаем ID категорий (если переданы объекты, извлекаем id)
          const categoryIds = extractCategoryIds(input.categories);

          // Получаем все категории включая родительские
          const allCategoryIds = await getAllCategoriesWithParents(tx, categoryIds);

          // Добавляем связи с категориями (включая родительские категории)
          await Promise.all(
            allCategoryIds.map((categoryId: string) =>
              tx.insert(productCategories).values({
                productId: created.id,
                categoryId: categoryId,
              }),
            ),
          );

          // Пересчитываем productsCount для всех затронутых категорий
          await recalculateCategoryProductsCount(tx, allCategoryIds);
        }

        // Возвращаем подготовленные данные для фронтенда
        return {
          id: created.id,
          name: created.name,
          slug: created.slug,
          description: created.description,
          isActive: created.isActive,
          isFeatured: created.isFeatured,
          isPopular: created.isPopular,
          isNew: created.isNew,
          brandId: created.brandId,
          stock: created.stock,
          basePrice: created.basePrice ? Number(created.basePrice) : null,
          salePrice: created.salePrice ? Number(created.salePrice) : null,
          discountPercent: created.discountPercent,
          hasVariants: created.hasVariants,
          sku: created.sku,
          seoTitle: created.seoTitle,
          seoUrl: created.seoUrl,
          seoDescription: created.seoDescription,
          seoKeywords: created.seoKeywords,
          productTypeId: created.productTypeId,
          xmlId: created.xmlId,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
      });
    } catch (error) {
      // Если это уже TRPCError, просто пробрасываем его
      if (error instanceof TRPCError) {
        throw error;
      }

      // Анализируем ошибку базы данных для более понятных сообщений
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Проверяем на дублирование slug
      if (errorMessage.includes("duplicate key") && errorMessage.includes("slug")) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Товар с таким URL уже существует. Пожалуйста, измените URL товара.",
        });
      }

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

      // Проверяем на обязательные поля
      if (errorMessage.includes("not null") && errorMessage.includes("name")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Название товара обязательно для заполнения.",
        });
      }

      if (errorMessage.includes("not null") && errorMessage.includes("slug")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "URL товара обязателен для заполнения.",
        });
      }

      // Общая ошибка базы данных
      if (errorMessage.includes("Failed query")) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Ошибка при сохранении товара в базу данных. Проверьте правильность заполнения всех полей.",
        });
      }

      // Для остальных ошибок
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Произошла ошибка при создании товара. Попробуйте еще раз или обратитесь к администратору.",
      });
    }
  });
