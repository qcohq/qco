import { eq, isNull, and } from "drizzle-orm";
import { asc } from "@qco/db";

import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { getChildrenSchema, type CategoryChildNode } from "@qco/validators";

export const getChildren = protectedProcedure
    .input(getChildrenSchema)
    .query(async ({ ctx, input }) => {
        const { parentId, isActive } = input;

        // Условия для фильтрации
        const whereConditions = [];

        if (parentId) {
            whereConditions.push(eq(categories.parentId, parentId));
        } else {
            whereConditions.push(isNull(categories.parentId));
        }

        if (isActive !== undefined) {
            whereConditions.push(eq(categories.isActive, isActive));
        }

        const childrenCategories = await ctx.db.query.categories.findMany({
            where: whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
            orderBy: (categories) => [asc(categories.sortOrder), asc(categories.name)],
        });

        // Для каждой дочерней категории также получаем информацию о наличии детей
        const result: CategoryChildNode[] = [];

        for (const category of childrenCategories) {
            // Проверяем, есть ли у категории дочерние элементы
            const hasChildren = await ctx.db.query.categories.findFirst({
                where: eq(categories.parentId, category.id),
                columns: { id: true },
            });

            result.push({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                parentId: category.parentId,
                children: hasChildren ? [] : [], // Пустой массив, но можно добавить логику для подсчета
            });
        }

        return result;
    }); 