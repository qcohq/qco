import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc, inArray, sql, count } from "@qco/db";
import { products, brands, productFiles, files } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const getBrandProductsSchema = z.object({
  brandSlug: z.string().min(1, "Brand slug is required"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort: z.enum(["newest", "price-asc", "price-desc", "name-asc", "name-desc", "popular"]).default("newest"),
});

const brandProductSchema = z.object({
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
  images: z.array(z.string()),
  category: z.string().nullable(),
  brand: z.string().nullable(),
});

const getBrandProductsResponseSchema = z.object({
  products: z.array(brandProductSchema),
  totalCount: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const getProducts = publicProcedure
  .input(getBrandProductsSchema)
  .output(getBrandProductsResponseSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { brandSlug, limit, offset, sort } = input;

      // Получаем бренд по slug
      const brand = await ctx.db.query.brands.findFirst({
        where: eq(brands.slug, brandSlug),
      });

      if (!brand) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Brand with slug "${brandSlug}" not found`,
        });
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
          case "popular":
            return [desc(products.isFeatured), desc(products.createdAt)];
          case "newest":
          default:
            return [desc(products.createdAt)];
        }
      })();

      // Получаем продукты бренда
      const productsData = await ctx.db.query.products.findMany({
        where: and(
          eq(products.brandId, brand.id),
          eq(products.isActive, true)
        ),
        with: {
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
        .where(and(
          eq(products.brandId, brand.id),
          eq(products.isActive, true)
        ));

      const totalCount = totalCountResult[0]?.count || 0;

      // Форматируем продукты
      const formattedProducts = productsData.map((product: any) => {
        // Получаем главное изображение (первый файл в отсортированном списке)
        const mainImage = product.files?.[0];
        const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

        // Получаем все изображения, сортируя их так, чтобы основное было первым
        const images = product.files
          ?.filter((f: any) => f.file?.path)
          .sort((a: any, b: any) => {
            // Основное изображение (type === "main") должно быть первым
            if (a.type === "main" && b.type !== "main") return -1;
            if (a.type !== "main" && b.type === "main") return 1;
            // Если оба имеют одинаковый тип, сортируем по порядку
            return (a.order || 0) - (b.order || 0);
          })
          .map((f: any) => getFileUrl(f.file.path)) || [];

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
          images,
          category: mainCategory ? mainCategory.name : null,
          brand: brand.name,
        };
      });

      return {
        products: formattedProducts,
        totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {

      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch brand products",
      });
    }
  }); 
