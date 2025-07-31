import { TRPCError } from "@trpc/server";
import { eq, desc, asc, like, count } from "@qco/db";
import { z } from "zod";

import { productTypes } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const list = protectedProcedure
    .input(z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }).optional().default({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
    }))
    .query(async ({ ctx, input }) => {
        const { page, limit, search, sortBy, sortOrder } = input;
        const offset = (page - 1) * limit;

        try {
            // Маппинг полей для сортировки
            const sortFieldMapping = {
                name: productTypes.name,
                createdAt: productTypes.createdAt,
                updatedAt: productTypes.updatedAt,
            } as const;

            // Определяем порядок сортировки
            const orderByField = sortFieldMapping[sortBy];
            const orderBy = sortOrder === "asc" ? asc(orderByField) : desc(orderByField);

            // Определяем условие поиска
            const searchCondition = search ? like(productTypes.name, `%${search}%`) : undefined;

            // Получаем типы продуктов с пагинацией и поиском
            const productTypesList = await ctx.db
                .select()
                .from(productTypes)
                .where(searchCondition)
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);

            // Подсчитываем общее количество
            const [totalCountResult] = await ctx.db
                .select({ count: count() })
                .from(productTypes)
                .where(searchCondition);

            const total = totalCountResult?.count ?? 0;
            const pageCount = Math.ceil(total / limit);

            return {
                items: productTypesList,
                meta: {
                    totalItems: total,
                    pageCount,
                    currentPage: page,
                    pageSize: limit,
                },
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось получить список типов продуктов",
                cause: error,
            });
        }
    }); 