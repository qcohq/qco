import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc } from "@qco/db";
import { products, productFiles, categories } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const getFeaturedSchema = z.object({
  limit: z.number().min(1).max(50).default(12),
  categorySlug: z.string().optional(), // Фильтр по категории
});

const featuredProductSchema = z.object({
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

const getFeaturedResponseSchema = z.array(featuredProductSchema);

export const getFeatured = publicProcedure
  .input(getFeaturedSchema)
  .output(getFeaturedResponseSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, categorySlug } = input;

      // Базовые условия для активных товаров
      const baseConditions = [eq(products.isActive, true)];

      // Если указана категория, добавляем фильтр по категории
      if (categorySlug) {
        // Сначала получаем ID категории по slug
        const category = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, categorySlug),
          columns: { id: true }
        });

        if (category) {
          // Получаем товары с фильтром по категории
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
            orderBy: [desc(products.isFeatured), desc(products.createdAt)],
          });

          // Фильтруем товары по категории на уровне приложения
          const filteredProducts = productsData.filter((product: any) =>
            product.categories?.some((pc: any) => pc.category?.id === category.id)
          );

          // Форматируем продукты
          const formattedProducts = filteredProducts.map((product: any) => {
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

          return formattedProducts;
        }
      }

      // Получаем избранные продукты без фильтра по категории
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
        orderBy: [desc(products.isFeatured), desc(products.createdAt)],
      });

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

      return formattedProducts;
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch featured products",
      });
    }
  }); 
