import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { products, productFiles, productCategories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";

import { protectedProcedure } from "../../trpc";

export const getById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    // Получаем продукт
    const product = await ctx.db.query.products.findFirst({
      where: eq(products.id, input.id),
    });

    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Товар с ID ${input.id} не найден`,
      });
    }

    // Получаем все файлы продукта
    const productFilesRaw = await ctx.db.query.productFiles.findMany({
      where: eq(productFiles.productId, input.id),
      with: {
        file: true,
      },
      orderBy: (productFiles, { asc }) => [
        // Сначала сортируем по типу: main должен быть первым
        asc(sql`CASE WHEN ${productFiles.type} = 'main' THEN 0 ELSE 1 END`),
        // Затем по порядку
        asc(productFiles.order),
      ],
    });

    // Для каждого файла получаем url
    const productFilesList = await Promise.all(
      productFilesRaw.map(
        (
          pf: typeof productFiles.$inferSelect & {
            file: any;
          },
        ) => {
          let url: string | null = null;
          if (pf.file?.path) {
            url = getFileUrl(pf.file.path);
          }
          return {
            ...pf,
            meta: {
              url,
              size: pf.file?.size || null,
              name: pf.file?.name || null,
              mimeType: pf.file?.mimeType || null,
            },
          };
        },
      ),
    );

    // Находим основное изображение (первый файл в отсортированном списке)
    const mainImage = productFilesList[0] || null;

    // Получаем категории продукта
    const productCategoriesList = await ctx.db.query.productCategories.findMany({
      where: eq(productCategories.productId, input.id),
      with: {
        category: true,
      },
    });

    // Преобразуем в массив категорий
    const categories = productCategoriesList.map(
      (
        pc: typeof productCategories.$inferSelect & {
          category: any;
        },
      ) => ({
        id: pc.category.id,
        name: pc.category.name,
      }),
    );

    // Возвращаем продукт с файлами, основным изображением и категориями
    return {
      ...product,
      basePrice: product.basePrice ? Number(product.basePrice) : null,
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      files: productFilesList,
      mainImage: mainImage ?? null,
      categories,
    };
  });
