import { TRPCError } from "@trpc/server";
import { eq, like, ne, and } from "@qco/db";
import { products } from "@qco/db/schema";
import { z } from "zod";
import slugify from "@sindresorhus/slugify";
import { protectedProcedure } from "../../trpc";

const generateUniqueSlugSchema = z.object({
    baseSlug: z.string().min(1, "Базовый URL обязателен"),
    excludeId: z.string().optional(), // ID товара для исключения при редактировании
});

export const generateUniqueSlug = protectedProcedure
    .input(generateUniqueSlugSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const { baseSlug, excludeId } = input;

            // Очищаем базовый слаг
            const cleanBaseSlug = slugify(baseSlug, { lowercase: true });

            // Проверяем, доступен ли базовый слаг
            const existingProduct = await ctx.db.query.products.findFirst({
                where: excludeId
                    ? and(eq(products.slug, cleanBaseSlug), ne(products.id, excludeId))
                    : eq(products.slug, cleanBaseSlug),
                columns: {
                    id: true,
                    slug: true,
                },
            });

            // Если базовый слаг доступен, возвращаем его
            if (!existingProduct) {
                return {
                    slug: cleanBaseSlug,
                    isOriginal: true,
                };
            }

            // Если слаг занят, ищем все существующие слаги с таким же префиксом
            const existingSlugs = await ctx.db.query.products.findMany({
                where: excludeId
                    ? and(like(products.slug, `${cleanBaseSlug}%`), ne(products.id, excludeId))
                    : like(products.slug, `${cleanBaseSlug}%`),
                columns: {
                    slug: true,
                },
            });

            // Создаем множество существующих слагов для быстрого поиска
            const existingSlugSet = new Set(existingSlugs.map(p => p.slug));

            // Генерируем уникальный слаг
            let counter = 1;
            let uniqueSlug = `${cleanBaseSlug}-${counter}`;

            // Ищем уникальный слаг, добавляя числа
            while (existingSlugSet.has(uniqueSlug)) {
                counter++;
                uniqueSlug = `${cleanBaseSlug}-${counter}`;

                // Защита от бесконечного цикла
                if (counter > 100) {
                    // Если не удалось найти уникальный слаг, добавляем случайный суффикс
                    const randomSuffix = Math.random().toString(36).substring(2, 8);
                    uniqueSlug = `${cleanBaseSlug}-${randomSuffix}`;
                    break;
                }
            }

            return {
                slug: uniqueSlug,
                isOriginal: false,
                originalSlug: cleanBaseSlug,
            };
        } catch (error) {


            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Ошибка при генерации уникального URL",
            });
        }
    }); 
