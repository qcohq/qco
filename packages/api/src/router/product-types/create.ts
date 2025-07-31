import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { z } from "zod";

import { productTypes } from "@qco/db/schema";
import { createProductTypeSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const create = protectedProcedure
    .input(createProductTypeSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            // Проверяем уникальность slug
            const existingProductType = await ctx.db.query.productTypes.findFirst({
                where: eq(productTypes.slug, input.slug),
            });

            if (existingProductType) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Тип продукта с таким slug уже существует",
                });
            }

            // Создаем новый тип продукта
            const [newProductType] = await ctx.db
                .insert(productTypes)
                .values({
                    name: input.name,
                    slug: input.slug,
                    description: input.description,
                })
                .returning();

            return newProductType;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось создать тип продукта",
                cause: error,
            });
        }
    }); 