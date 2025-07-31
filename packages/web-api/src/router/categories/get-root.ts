import { eq, asc, isNull } from "@qco/db";
import { categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import {
  getRootCategoriesInputSchema,
  getRootCategoriesResponseSchema
} from "@qco/web-validators";
import {
  getCategoryProductsCount,
  getCategoryChildrenInfo,
  formatCategory
} from "./utils";

export const getRoot = publicProcedure
  .input(getRootCategoriesInputSchema)
  .output(getRootCategoriesResponseSchema)
  .query(async ({ input, ctx }) => {
    const { includeInactive = false } = input || {};

    // Получаем корневые категории (без родителя)
    const rootCategories = await ctx.db.query.categories.findMany({
      where: includeInactive ? isNull(categories.parentId) : eq(categories.isActive, true),
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
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    });

    // Получаем количество товаров для каждой категории
    const productsCountMap = await getCategoryProductsCount(ctx);

    // Получаем информацию о дочерних категориях
    const hasChildrenMap = await getCategoryChildrenInfo(ctx);

    // Форматируем категории для ответа
    const formattedCategories = await Promise.all(
      rootCategories.map((category) =>
        formatCategory(category, productsCountMap, hasChildrenMap)
      )
    );

    return formattedCategories;
  }); 
