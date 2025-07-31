import { z } from "zod";
import type { TRPCContext } from "../../trpc";
import { publicProcedure } from "../../trpc";
import { eq, inArray, desc, and } from "@qco/db";
import { products, categories, productCategories } from "@qco/db/schema";
import { db } from "@qco/db/client";
import { getFileUrl } from "@qco/lib";
import type { GetNewArrivalsProduct } from "@qco/web-validators";

// Типы для внутреннего использования
interface ProductFileType {
  id: string;
  type: string;
  file?: {
    id: string;
    path: string;
  };
}

interface ProductCategoryRelationType {
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// GetNewArrivalsProduct уже определен выше

/**
 * Получает популярные товары по slug категории
 * @param ctx Контекст tRPC
 * @param slug Slug категории
 * @param limit Максимальное количество товаров
 * @returns Массив популярных товаров
 */
async function getPopularByCategoryFn(
  _ctx: TRPCContext,
  slug: string,
  limit = 8,
): Promise<GetNewArrivalsProduct[]> {
  try {
    // Получаем категорию по slug
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });

    if (!category) {
      return [];
    }

    // Получаем ID товаров из выбранной категории
    const productCategoriesData = await db.query.productCategories.findMany({
      where: eq(productCategories.categoryId, category.id),
      with: {
        product: true,
      },
    });

    if (!productCategoriesData.length) {
      return [];
    }

    // Получаем ID товаров
    const productIds = productCategoriesData.map((pc: any) => pc.productId);

    // Получаем товары с дополнительными данными
    const productsData = await db.query.products.findMany({
      where: and(
        inArray(products.id, productIds),
        eq(products.isActive, true),
      ),
      with: {
        brand: true,
        files: {
          with: {
            file: true,
          },
        },
        categories: {
          with: {
            category: true,
          },
        },
      },
      orderBy: desc(products.createdAt),
      limit,
    });

    // Преобразуем полученные товары в нужный формат
    return productsData.map((product: any) => {
      // Безопасно извлекаем данные о файлах
      const productFiles = product.files || [];
      const mainImageFile =
        productFiles.length > 0
          ? (productFiles.find((pf: ProductFileType) => pf.type === "main") ??
            productFiles[0])
          : null;

      // Находим категорию товара, предпочитая ту, которая соответствует запрошенной категории
      const matchingCategory = product.categories?.find(
        (c: ProductCategoryRelationType) => c.categoryId === category.id,
      );

      const productCategory =
        matchingCategory?.category ?? product.categories?.[0]?.category ?? null;

      // Формируем объект товара для возврата
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice ? Number(product.basePrice) : null,
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        discountPercent: product.discountPercent,
        stock: product.stock,
        sku: product.sku,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isNew: product.isNew || false,
        isBestseller: product.isBestseller || false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        image: mainImageFile?.file?.path
          ? getFileUrl(mainImageFile.file.path)
          : null,
        category: productCategory?.name,
        brand: product.brand?.name,
      };
    });
  } catch (error: unknown) {
    return [];
  }
}

/**
 * tRPC-процедура: получить популярные товары по slug категории
 */
export const getPopularByCategory = publicProcedure
  .input(
    z.object({
      slug: z.string(),
      limit: z.number().optional().default(8),
    }),
  )
  .query(({ ctx, input }) => {
    return getPopularByCategoryFn(ctx, input.slug, input.limit);
  });
