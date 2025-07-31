import { TRPCError } from "@trpc/server";
import { eq, ne, and } from "@qco/db";
import { z } from "zod";

import { productTypes } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const checkSlugUniqueness = protectedProcedure
    .input(z.object({
        slug: z.string().min(1, "Slug не может быть пустым"),
        excludeId: z.string().optional(), // Исключить конкретный ID при проверке (для редактирования)
    }))
    .query(async ({ ctx, input }) => {
        try {
            const whereCondition = input.excludeId
                ? and(
                    eq(productTypes.slug, input.slug),
                    ne(productTypes.id, input.excludeId)
                )
                : eq(productTypes.slug, input.slug);

            const existingProductType = await ctx.db.query.productTypes.findFirst({
                where: whereCondition,
            });

            return {
                isUnique: !existingProductType,
                message: existingProductType
                    ? "Тип продукта с таким slug уже существует"
                    : "Slug доступен для использования"
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось проверить уникальность slug",
                cause: error,
            });
        }
    }); 