import { eq, isNull, and, count } from "drizzle-orm";
import { asc } from "@qco/db";

import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { getFolderViewSchema, type CategoryFolderNode } from "@qco/validators";

export const getFolderView = protectedProcedure
    .input(getFolderViewSchema)
    .query(async ({ ctx, input }) => {
        const { parentId, isActive } = input;

        // Условия для фильтрации
        const whereConditions = [];

        if (parentId !== undefined) {
            if (parentId) {
                whereConditions.push(eq(categories.parentId, parentId));
            } else {
                whereConditions.push(isNull(categories.parentId));
            }
        }

        if (isActive !== undefined) {
            whereConditions.push(eq(categories.isActive, isActive));
        }

        const folderCategories = await ctx.db.query.categories.findMany({
            where: whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
            orderBy: (categories) => [asc(categories.sortOrder), asc(categories.name)],
        });

        // Для каждой категории получаем количество дочерних элементов
        const result: CategoryFolderNode[] = [];

        for (const category of folderCategories) {
            // Подсчитываем количество дочерних элементов
            const childrenCountResult = await ctx.db
                .select({ count: count() })
                .from(categories)
                .where(eq(categories.parentId, category.id));

            const childrenCount = childrenCountResult[0]?.count || 0;

            result.push({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                parentId: category.parentId,
                children: [], // Для папочного представления не загружаем детей сразу
                childrenCount,
            });
        }

        return result;
    }); 