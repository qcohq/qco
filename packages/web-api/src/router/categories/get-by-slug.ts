import { eq } from "@qco/db";
import { categories } from "@qco/db/schema";
import { TRPCError } from "@trpc/server";
import {
  getCategoryBySlugInputSchema,
  getCategoryBySlugResponseSchema,
} from "@qco/web-validators";
import { publicProcedure } from "../../trpc";
import {
  getCategoryProductsCount,
  getCategoryChildrenInfo,
  formatCategory
} from "./utils";

export const getBySlug = publicProcedure
  .input(getCategoryBySlugInputSchema)
  .output(getCategoryBySlugResponseSchema)
  .query(async ({ input, ctx }) => {
    const { slug } = input;

    const category = await ctx.db.query.categories.findFirst({
      where: eq(categories.slug, slug),
      with: {
        image: {
          columns: {
            id: true,
            path: true,
            name: true,
            mimeType: true,
            size: true,
          },
        },
      },
    });

    if (!category) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Категория со slug "${slug}" не найдена`,
      });
    }

    // Получаем количество товаров для категории
    const productsCountMap = await getCategoryProductsCount(ctx);

    // Получаем информацию о дочерних категориях
    const hasChildrenMap = await getCategoryChildrenInfo(ctx);

    // Форматируем категорию для ответа
    return await formatCategory(category, productsCountMap, hasChildrenMap);
  });
