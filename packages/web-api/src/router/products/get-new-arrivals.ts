import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc } from "@qco/db";
import { products, productFiles, categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import {
  getNewArrivalsInputSchema,
  getNewArrivalsResponseSchema
} from "@qco/web-validators";

export const getNewArrivals = publicProcedure
  .input(getNewArrivalsInputSchema)
  .output(getNewArrivalsResponseSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { limit, days, categorySlug } = input;

      // Вычисляем дату, начиная с которой товары считаются новыми
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Базовые условия для активных и новых товаров
      const baseConditions = [
        eq(products.isActive, true),
        eq(products.isNew, true)
      ];

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
            orderBy: [desc(products.createdAt)],
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

            // Получаем все изображения
            const images = product.files
              ?.filter((f: any) => f.file?.path)
              .map((f: any) => getFileUrl(f.file.path)) || [];

            // Получаем основную категорию
            const mainCategory = product.categories?.[0]?.category;

            return {
              id: product.id,
              brandId: product.brandId,
              name: product.name,
              slug: product.slug,
              description: product.description,
              isActive: product.isActive,
              isFeatured: product.isFeatured,
              isPopular: product.isPopular || false,
              isNew: product.isNew || false,
              stock: product.stock,
              sku: product.sku,
              basePrice: product.basePrice ? Number(product.basePrice) : null,
              salePrice: product.salePrice ? Number(product.salePrice) : null,
              discountPercent: product.discountPercent,
              hasVariants: product.hasVariants || false,
              productTypeId: product.productTypeId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
              seoTitle: product.seoTitle,
              seoUrl: product.seoUrl,
              seoDescription: product.seoDescription,
              seoKeywords: product.seoKeywords,
              xmlId: product.xmlId,
              image,
              images,
              category: mainCategory ? mainCategory.name : null,
              brand: product.brand ? product.brand.name : null,
            };
          });

          return formattedProducts;
        }
      }

      // Получаем новые товары без фильтра по категории
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
        orderBy: [desc(products.createdAt)],
      });

      // Форматируем продукты
      const formattedProducts = productsData.map((product: any) => {
        // Получаем главное изображение (первый файл в отсортированном списке)
        const mainImage = product.files?.[0];
        const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

        // Получаем все изображения
        const images = product.files
          ?.filter((f: any) => f.file?.path)
          .map((f: any) => getFileUrl(f.file.path)) || [];

        // Получаем основную категорию
        const mainCategory = product.categories?.[0]?.category;

        return {
          id: product.id,
          brandId: product.brandId,
          name: product.name,
          slug: product.slug,
          description: product.description,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isPopular: product.isPopular || false,
          isNew: product.isNew || false,
          stock: product.stock,
          sku: product.sku,
          basePrice: product.basePrice ? Number(product.basePrice) : null,
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          discountPercent: product.discountPercent,
          hasVariants: product.hasVariants || false,
          productTypeId: product.productTypeId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          seoTitle: product.seoTitle,
          seoUrl: product.seoUrl,
          seoDescription: product.seoDescription,
          seoKeywords: product.seoKeywords,
          xmlId: product.xmlId,
          image,
          images,
          category: mainCategory ? mainCategory.name : null,
          brand: product.brand ? product.brand.name : null,
        };
      });

      return formattedProducts;
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch new arrivals",
      });
    }
  });
