import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import slugify from "@sindresorhus/slugify";

import { brands } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

// Функция для генерации слага из названия
function generateSlug(name: string): string {
    return slugify(name, {
        lowercase: true,
        separator: '-'
    });
}

// Функция для проверки уникальности слага
async function checkSlugUniqueness(
    ctx: any,
    slug: string,
    excludeId?: string
): Promise<boolean> {
    const existingBrand = await ctx.db.query.brands.findFirst({
        where: eq(brands.slug, slug),
    });

    // Если бренд не найден, слаг уникален
    if (!existingBrand) {
        return true;
    }

    // Если excludeId указан и найденный бренд совпадает с исключаемым ID, то слаг уникален
    if (excludeId && existingBrand.id === excludeId) {
        return true;
    }

    // В остальных случаях слаг не уникален
    return false;
}

// Функция для генерации уникального слага
async function generateUniqueSlug(
    ctx: any,
    name: string,
    excludeId?: string
): Promise<string> {
    const baseSlug = generateSlug(name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    const maxAttempts = 100; // Максимальное количество попыток

    while (!(await checkSlugUniqueness(ctx, uniqueSlug, excludeId))) {
        if (counter > maxAttempts) {
            throw new Error(`Не удалось сгенерировать уникальный слаг после ${maxAttempts} попыток`);
        }
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

const generateSlugSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    excludeId: z.string().optional(),
});

export const generateSlugRoute = protectedProcedure
    .input(generateSlugSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            const { name, excludeId } = input;

            const uniqueSlug = await generateUniqueSlug(ctx, name, excludeId);

            return {
                slug: uniqueSlug,
                isUnique: true,
            };
        } catch (error) {
            // Определяем тип ошибки для более точной обработки
            if (error instanceof Error && error.message.includes("Не удалось сгенерировать уникальный слаг")) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Не удалось сгенерировать уникальный слаг. Попробуйте изменить название.",
                });
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : "Ошибка при генерации слага",
            });
        }
    }); 