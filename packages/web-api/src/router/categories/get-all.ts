import { eq, asc, and } from "@qco/db";
import { categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getAllCategoriesResponseSchema } from "@qco/web-validators";
import {
  getCategoryProductsCount,
  getCategoryChildrenInfo,
  formatCategory
} from "./utils";

export const getAll = publicProcedure
  .output(getAllCategoriesResponseSchema)
  .query(async ({ ctx }) => {
    // Получаем только категории первого уровня (корневые) с изображениями
    const allCategories = await ctx.db.query.categories.findMany({
      where: and(
        eq(categories.isActive, true),
        eq(categories.parentId, null)
      ),
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
      allCategories.map((category) =>
        formatCategory(category, productsCountMap, hasChildrenMap)
      )
    );

    return formattedCategories;
  });
