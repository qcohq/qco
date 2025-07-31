import { eq, asc } from "@qco/db";
import { categories } from "@qco/db/schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import {
    getChildrenByParentInputSchema,
    getChildrenByParentResponseSchema
} from "@qco/web-validators";
import {
    getCategoryProductsCount,
    getCategoryChildrenInfo,
    formatCategory
} from "./utils";

export const getChildrenByParent = publicProcedure
    .input(getChildrenByParentInputSchema)
    .output(getChildrenByParentResponseSchema)
    .query(async ({ input, ctx }) => {
        const { parentId } = input || {};

        if (!parentId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "ID родительской категории обязателен",
            });
        }

        // Проверяем, что родительская категория существует
        const parentCategory = await ctx.db.query.categories.findFirst({
            where: eq(categories.id, parentId),
        });

        if (!parentCategory) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Родительская категория с ID "${parentId}" не найдена`,
            });
        }

        // Получаем дочерние категории
        const childCategories = await ctx.db.query.categories.findMany({
            where: eq(categories.parentId, parentId),
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
            childCategories.map((category) =>
                formatCategory(category, productsCountMap, hasChildrenMap)
            )
        );

        return formattedCategories;
    }); 
