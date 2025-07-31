import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc, like, or, inArray, count, isNotNull, gt } from "@qco/db";
import { products, productCategories, productFiles, files, brands, categories } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const searchProductsSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort: z.enum(["relevance", "newest", "price-asc", "price-desc", "name-asc", "name-desc"]).default("relevance"),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  onSale: z.boolean().optional(),
});

const searchProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  basePrice: z.number().nullable(),
  salePrice: z.number().nullable(),
  discountPercent: z.number().nullable(),
  stock: z.number().nullable(),
  sku: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  image: z.string().nullable(),
  category: z.string().nullable(),
  brand: z.string().nullable(),
});

const searchResponseSchema = z.object({
  products: z.array(searchProductSchema),
  totalCount: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  query: z.string(),
});

export const search = publicProcedure
  .input(searchProductsSchema)
  .output(searchResponseSchema)
  .query(async ({ ctx, input }) => {
    try {
      const {
        query,
        limit,
        offset,
        sort,
        categoryId,
        brandId,
        minPrice,
        maxPrice,
        inStock,
        onSale
      } = input;

      // Базовые условия поиска
      const baseConditions = [
        eq(products.isActive, true),
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`),
          like(products.sku, `%${query}%`)
        )
      ];

      // Фильтр по категории
      if (categoryId) {
        const productIds = await ctx.db
          .select({ productId: productCategories.productId })
          .from(productCategories)
          .where(eq(productCategories.categoryId, categoryId));

        if (productIds.length > 0) {
          baseConditions.push(inArray(products.id, productIds.map((p: any) => p.productId)));
        } else {
          // Если нет продуктов в категории, возвращаем пустой результат
          return {
            products: [],
            totalCount: 0,
            page: Math.floor(offset / limit) + 1,
            limit,
            totalPages: 0,
            query,
          };
        }
      }

      // Фильтр по бренду
      if (brandId) {
        baseConditions.push(eq(products.brandId, brandId));
      }

      // Фильтр по цене
      if (minPrice !== undefined) {
        baseConditions.push(eq(products.basePrice, minPrice.toString()));
      }
      if (maxPrice !== undefined) {
        baseConditions.push(eq(products.basePrice, maxPrice.toString()));
      }

      // Фильтр по наличию
      if (inStock !== undefined) {
        if (inStock) {
          baseConditions.push(gt(products.stock, 0)); // В наличии
        } else {
          baseConditions.push(eq(products.stock, 0)); // Нет в наличии
        }
      }

      // Фильтр по скидкам
      if (onSale !== undefined && onSale) {
        baseConditions.push(isNotNull(products.salePrice)); // Есть скидка
      }

      // Определяем сортировку
      const orderBy = (() => {
        switch (sort) {
          case "price-asc":
            return [asc(products.basePrice)];
          case "price-desc":
            return [desc(products.basePrice)];
          case "name-asc":
            return [asc(products.name)];
          case "name-desc":
            return [desc(products.name)];
          case "newest":
            return [desc(products.createdAt)];
          case "relevance":
          default:
            // Для релевантности сортируем по дате создания (новые сначала)
            return [desc(products.createdAt)];
        }
      })();

      // Получаем продукты
      const productsData = await ctx.db.query.products.findMany({
        where: and(...baseConditions),
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
          categories: {
            with: {
              category: {
                columns: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          files: {
            with: {
              file: {
                columns: {
                  id: true,
                  path: true,
                },
              },
            },
            orderBy: [
              // Сначала файлы с типом "main", затем остальные по порядку
              desc(eq(productFiles.type, "main")),
              asc(productFiles.order),
            ],
          },
        },
        limit,
        offset,
        orderBy,
      });

      // Получаем общее количество
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(products)
        .where(and(...baseConditions));

      const totalCount = totalCountResult[0]?.count || 0;

      // Форматируем продукты
      const formattedProducts = productsData.map((product: any) => {
        // Получаем главное изображение (первый файл в отсортированном списке)
        const mainImage = product.files?.[0];
        const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

        // Получаем основную категорию
        const mainCategory = product.categories?.[0]?.category;

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
          image,
          category: mainCategory ? mainCategory.name : null,
          brand: product.brand ? product.brand.name : null,
        };
      });

      return {
        products: formattedProducts,
        totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        query,
      };
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to search products",
      });
    }
  }); 
