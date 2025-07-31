import { eq, asc } from "@qco/db";
import { categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getCategoryTreeResponseSchema } from "@qco/web-validators";
import {
  getCategoryProductsCount,
  getCategoryChildrenInfo,
  formatCategory
} from "./utils";

export const getTree = publicProcedure
  .output(getCategoryTreeResponseSchema)
  .query(async ({ ctx }) => {
    // Получаем все категории с изображениями
    const allCategories = await ctx.db.query.categories.findMany({
      where: eq(categories.isActive, true),
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

    // Создаем мапу категорий для быстрого доступа
    const categoryMap = new Map<string, any>();
    allCategories.forEach((category) => {
      categoryMap.set(category.id, category);
    });

    // Форматируем категории
    const formattedCategories = await Promise.all(
      allCategories.map((category) =>
        formatCategory(category, productsCountMap, hasChildrenMap, categoryMap)
      )
    );

    // Строим дерево категорий
    const categoryNodeMap = new Map<string, any>();
    const rootCategories: any[] = [];

    // Создаем узлы дерева
    formattedCategories.forEach((category) => {
      categoryNodeMap.set(category.id, {
        ...category,
        children: [],
      });
    });

    // Строим иерархию
    formattedCategories.forEach((category) => {
      const categoryNode = categoryNodeMap.get(category.id);

      if (category.parentId) {
        // Это дочерняя категория
        const parent = categoryNodeMap.get(category.parentId);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        // Это корневая категория
        rootCategories.push(categoryNode);
      }
    });

    // Очищаем пустые массивы children
    const cleanTree = (nodes: any[]): any[] => {
      return nodes.map((node) => ({
        ...node,
        children: node.children.length > 0 ? cleanTree(node.children) : undefined,
      }));
    };

    return cleanTree(rootCategories);
  });
