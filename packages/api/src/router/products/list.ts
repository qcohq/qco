import { TRPCError } from "@trpc/server";
import { and, eq, ilike, inArray, sql, asc, desc } from "drizzle-orm";
import { z } from "zod";
import type { SQL } from "drizzle-orm";

import {
  products,
  productFiles,
  productCategories,
  productTypes,
} from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";

import { protectedProcedure } from "../../trpc";
import { ProductListResponseSchema } from "@qco/validators";
import { ProductListInputSchema } from "@qco/validators";

export const list = protectedProcedure
  .input(ProductListInputSchema)
  .query(async ({ ctx, input }) => {
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      categories,
      minPrice = 0,
      maxPrice = 10000,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = input;

    // Определяем порядок сортировки
    let orderByClause;
    switch (sortBy) {
      case "name":
        orderByClause = sortOrder === "asc" ? asc(products.name) : desc(products.name);
        break;
      case "price":
        orderByClause = sortOrder === "asc" ? asc(products.basePrice) : desc(products.basePrice);
        break;
      case "stock":
        orderByClause = sortOrder === "asc" ? asc(products.stock) : desc(products.stock);
        break;
      case "updatedAt":
        orderByClause = sortOrder === "asc" ? asc(products.updatedAt) : desc(products.updatedAt);
        break;
      default:
        orderByClause = sortOrder === "asc" ? asc(products.createdAt) : desc(products.createdAt);
    }

    // Создаем условия для фильтрации
    const whereConditions = [];
    if (search) {
      whereConditions.push(ilike(products.name, `%${search}%`));
    }
    if (status) {
      whereConditions.push(eq(products.isActive, status === "active"));
    }
    if (minPrice > 0) {
      whereConditions.push(sql`${products.basePrice} >= ${minPrice}`);
    }
    if (maxPrice < 10000) {
      whereConditions.push(sql`${products.basePrice} <= ${maxPrice}`);
    }

    let productsList: any[] = [];
    let total = 0;
    let pageCount = 0;

    if (categories && categories.length > 0) {
      // Получаем продукты, которые принадлежат указанным категориям
      const productsInCategories = await ctx.db
        .select({ productId: productCategories.productId })
        .from(productCategories)
        .where(inArray(productCategories.categoryId, categories))
        .groupBy(productCategories.productId);

      const productIdsInCategories = productsInCategories.map(p => p.productId);

      if (productIdsInCategories.length === 0) {
        // Если нет продуктов в указанных категориях, возвращаем пустой результат
        return {
          items: [],
          meta: {
            totalItems: 0,
            pageCount: 0,
            currentPage: page,
            pageSize: limit,
          },
        };
      }

      // Добавляем условие фильтрации по ID продуктов
      const finalWhereConditions = [...whereConditions, inArray(products.id, productIdsInCategories)];
      const finalWhereClause = and(...finalWhereConditions);

      // Подсчет общего количества продуктов с фильтром по категориям
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(finalWhereClause);

      total = countResult[0]?.count ?? 0;
      pageCount = Math.ceil(total / limit);

      // Получаем продукты с пагинацией и сортировкой
      productsList = await ctx.db.query.products.findMany({
        where: finalWhereClause,
        limit,
        offset: (page - 1) * limit,
        orderBy: [orderByClause],
      });
    } else {
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Подсчет общего количества продуктов
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereClause);

      total = countResult[0]?.count ?? 0;
      pageCount = Math.ceil(total / limit);

      // Получаем продукты с пагинацией и сортировкой
      productsList = await ctx.db.query.products.findMany({
        where: whereClause,
        limit,
        offset: (page - 1) * limit,
        orderBy: [orderByClause],
      });
    }

    // Получаем ID всех продуктов
    const productIds = productsList.map((p: any) => p.id);

    // Получаем категории для всех продуктов одной пачкой
    let productCategoriesList: { productId: string; categoryId: string }[] = [];
    if (productIds.length > 0) {
      productCategoriesList = await ctx.db
        .select({
          productId: productCategories.productId,
          categoryId: productCategories.categoryId,
        })
        .from(productCategories)
        .where(inArray(productCategories.productId, productIds));
    }

    // Группируем категории по продуктам
    const productToCategoriesMap = new Map<string, string[]>();
    for (const pc of productCategoriesList) {
      if (!productToCategoriesMap.has(pc.productId)) {
        productToCategoriesMap.set(pc.productId, []);
      }
      const categories = productToCategoriesMap.get(pc.productId);
      if (categories) {
        categories.push(pc.categoryId);
      }
    }

    // Получаем уникальные ID категорий
    const allCategoryIds = Array.from(
      new Set(
        productCategoriesList.map((pc: { categoryId: string }) => pc.categoryId),
      ),
    );

    // Получаем данные о категориях одной пачкой
    let categoriesData: { id: string; name: string }[] = [];
    if (allCategoryIds.length > 0) {
      categoriesData = await ctx.db.query.categories.findMany({
        where: (fields, { inArray }) => inArray(fields.id, allCategoryIds),
        columns: {
          id: true,
          name: true,
        },
      });
    }

    // Создаем мапу категорий для быстрого доступа
    const categoriesMap = new Map(categoriesData.map((c) => [c.id, c]));

    // Получаем ID всех брендов из всех продуктов
    const brandIds = productsList
      .map((product) => product.brandId)
      .filter(Boolean) as string[];

    // Получаем данные о брендах одной пачкой
    let brandsData: { id: string; name: string; slug: string }[] = [];
    if (brandIds.length > 0) {
      brandsData = await ctx.db.query.brands.findMany({
        where: (fields, { inArray }) => inArray(fields.id, brandIds),
        columns: {
          id: true,
          name: true,
          slug: true,
        },
      });
    }

    // Создаем мапу брендов для быстрого доступа
    const brandsMap = new Map(brandsData.map((b) => [b.id, b]));

    // Получаем изображения для всех продуктов одной пачкой, сортируя по типу и порядку
    let mainImages: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      type: string;
      fileId: string;
      order: number | null;
      productId: string;
      alt: string | null;
      file: {
        id: string;
        path?: string;
        name?: string;
        mimeType?: string;
        size?: number;
        uploadedBy?: string;
      };
    }[] = [];
    if (productIds.length > 0) {
      mainImages = await ctx.db.query.productFiles.findMany({
        where: (fields, { inArray }) => inArray(fields.productId, productIds),
        with: {
          file: true,
        },
        orderBy: [
          // Сначала файлы с типом "main", затем остальные по порядку
          desc(eq(productFiles.type, "main")),
          asc(productFiles.order),
        ],
      });
    }

    // Мапа productId -> mainImage (берем первое изображение для каждого продукта)
    const mainImageMap = new Map<
      string,
      {
        fileId: string;
        url: string | null;
        alt: string | null;
        meta: {
          name: string | null;
          mimeType: string | null;
          size: number | null;
        };
      }
    >();
    const processedProducts = new Set<string>();
    for (const img of mainImages) {
      if (!processedProducts.has(img.productId)) {
        let url: string | null = null;
        if (img.file?.path) {
          url = getFileUrl(img.file.path);
        }
        mainImageMap.set(img.productId, {
          fileId: img.fileId,
          url,
          alt: img.alt ?? null,
          meta: {
            name: img.file?.name ?? null,
            mimeType: img.file?.mimeType ?? null,
            size: img.file?.size ?? null,
          },
        });
        processedProducts.add(img.productId);
      }
    }

    // Формируем результат
    const items = productsList.map((product) => {
      const productCategories = productToCategoriesMap.get(product.id) || [];
      const categories = productCategories
        .map((catId) => categoriesMap.get(catId))
        .filter(Boolean) as { id: string; name: string }[];

      const brand = product.brandId ? brandsMap.get(product.brandId) : null;
      const mainImage = mainImageMap.get(product.id);

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: Number(product.basePrice) || 0,
        discount: product.discountPercent || 0,
        stock: product.stock || 0,
        isActive: product.isActive,
        status: product.isActive ? "Активен" : "Неактивен",
        categories,
        brand: brand ? {
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        } : null,
        mainImage: mainImage ? {
          url: mainImage.url,
          alt: mainImage.alt,
        } : null,
      };
    });

    return {
      items,
      meta: {
        totalItems: total,
        pageCount,
        currentPage: page,
        pageSize: limit,
      },
    };
  });
