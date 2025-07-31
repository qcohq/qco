import { TRPCError } from "@trpc/server";
import { isNull } from "drizzle-orm";

import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getFirstLevel = protectedProcedure.query(async ({ ctx }) => {
    try {
        // Получаем только категории первого уровня (без родительских категорий)
        const categoriesList = await ctx.db.query.categories.findMany({
            where: isNull(categories.parentId),
            orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
        });

        return categoriesList;
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Ошибка получения категорий первого уровня",
        });
    }
}); 
