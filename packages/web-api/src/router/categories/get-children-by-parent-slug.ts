import { eq, asc } from "@qco/db";
import { categories } from "@qco/db/schema";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import {
    getCategoryProductsCount,
    getCategoryChildrenInfo,
    formatCategory
} from "./utils";

export const getChildrenByParentSlug = publicProcedure
    .input(z.object({
        parentSlug: z.string().min(1, "Slug родительской категории обязателен"),
    }))
    .query(async ({ input, ctx }) => {
        const { parentSlug } = input;

        // Сначала находим родительскую категорию по slug
        const parentCategory = await ctx.db.query.categories.findFirst({
            where: eq(categories.slug, parentSlug),
        });

        if (!parentCategory) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: `Родительская категория со slug "${parentSlug}" не найдена`,
            });
        }

        // Получаем дочерние категории
        const childCategories = await ctx.db.query.categories.findMany({
            where: eq(categories.parentId, parentCategory.id),
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