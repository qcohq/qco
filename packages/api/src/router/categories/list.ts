import { TRPCError } from "@trpc/server";
import { eq, ilike, sql } from "drizzle-orm";

import { categories, files } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { listCategoriesSchema } from "@qco/validators";

export const list = protectedProcedure
    .input(listCategoriesSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { page = 1, limit = 12, search = "" } = input;
            const whereClause = search
                ? ilike(categories.name, `%${search}%`)
                : undefined;
            const [totalObj] = await ctx.db
                .select({ count: sql<number>`count(*)` })
                .from(categories)
                .where(whereClause);
            const total = totalObj?.count ?? 0;
            const pageCount = Math.ceil(total / limit);
            const categoriesList = await ctx.db.query.categories.findMany({
                where: whereClause,
                limit,
                offset: (page - 1) * limit,
                orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
            });

            // Получаем объект image для каждой категории
            const { getFileUrl } = await import("@qco/lib");
            const categoriesWithImage = await Promise.all(
                categoriesList.map(async (cat: typeof categories.$inferSelect) => {
                    let image = null;
                    if (cat.imageId) {
                        const file = await ctx.db.query.files.findFirst({
                            where: eq(files.id, cat.imageId),
                        });
                        if (file?.path) {
                            image = {
                                fileId: file.id,
                                url: getFileUrl(file.path),
                                meta: {
                                    name: file.name,
                                    mimeType: file.mimeType,
                                    size: file.size,
                                },
                            };
                        }
                    }
                    return { ...cat, image, productsCount: cat.productsCount ?? 0 };
                }),
            );
            return {
                items: categoriesWithImage,
                meta: {
                    total,
                    page,
                    limit,
                    pageCount,
                },
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Ошибка получения категорий",
            });
        }
    }); 
