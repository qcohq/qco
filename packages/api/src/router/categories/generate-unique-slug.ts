import { TRPCError } from "@trpc/server";
import { eq, like, ne, and } from "@qco/db";
import { categories } from "@qco/db/schema";
import slugify from "@sindresorhus/slugify";
import { protectedProcedure } from "../../trpc";
import { generateUniqueSlugSchema } from "@qco/validators";

export const generateUniqueSlug = protectedProcedure
    .input(generateUniqueSlugSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const { baseSlug, excludeId } = input;

            // Очищаем базовый слаг
            const cleanBaseSlug = slugify(baseSlug, { lowercase: true });

            // Проверяем, доступен ли базовый слаг
            const existingCategory = await ctx.db.query.categories.findFirst({
                where: excludeId
                    ? and(eq(categories.slug, cleanBaseSlug), ne(categories.id, excludeId))
                    : eq(categories.slug, cleanBaseSlug),
                columns: {
                    id: true,
                    slug: true,
                },
            });

            // Если базовый слаг доступен, возвращаем его
            if (!existingCategory) {
                return {
                    slug: cleanBaseSlug,
                    isOriginal: true,
                };
            }

            // Если слаг занят, ищем все существующие слаги с таким же префиксом
            const existingSlugs = await ctx.db.query.categories.findMany({
                where: excludeId
                    ? and(like(categories.slug, `${cleanBaseSlug}%`), ne(categories.id, excludeId))
                    : like(categories.slug, `${cleanBaseSlug}%`),
                columns: {
                    slug: true,
                },
            });

            // Извлекаем номера из существующих слагов
            const usedNumbers = new Set<number>();
            existingSlugs.forEach(({ slug }) => {
                const match = new RegExp(`^${cleanBaseSlug}-(\\d+)$`).exec(slug);
                if (match?.[1]) {
                    usedNumbers.add(Number.parseInt(match[1], 10));
                }
            });

            // Находим первый свободный номер
            let counter = 1;
            while (usedNumbers.has(counter)) {
                counter++;
            }

            const uniqueSlug = `${cleanBaseSlug}-${counter}`;

            return {
                slug: uniqueSlug,
                isOriginal: false,
                counter,
            };
        } catch (error) {
            console.error("Ошибка при генерации уникального URL категории:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Ошибка при генерации уникального URL категории",
            });
        }
    }); 