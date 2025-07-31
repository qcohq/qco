import { eq } from "drizzle-orm";
import { asc } from "@qco/db";

import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { getCategoryTreeSchema, type CategoryTreeNode } from "@qco/validators";

export const getCategoryTree = protectedProcedure
    .input(getCategoryTreeSchema)
    .query(async ({ ctx, input }) => {
        const { isActive } = input;
        const whereConditions = [];
        if (isActive !== undefined) {
            whereConditions.push(eq(categories.isActive, isActive));
        }

        // Получаем все категории
        const categoriesList = await ctx.db.query.categories.findMany({
            where: whereConditions.length > 0 ? whereConditions[0] : undefined,
            orderBy: (categories) => [asc(categories.sortOrder), asc(categories.name)],
        });

        // Строим дерево категорий
        const categoryMap = new Map<string, CategoryTreeNode>();
        const rootCategories: CategoryTreeNode[] = [];

        // Создаем мапу для быстрого доступа к категориям по ID
        categoriesList.forEach((category) => {
            categoryMap.set(category.id, {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                parentId: category.parentId,
                children: [],
            });
        });

        // Строим иерархию
        categoriesList.forEach((category) => {
            const categoryNode = categoryMap.get(category.id);
            if (!categoryNode) return;

            if (category.parentId) {
                // Это дочерняя категория
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryNode);
                }
            } else {
                // Это корневая категория
                rootCategories.push(categoryNode);
            }
        });

        return rootCategories;
    }); 
