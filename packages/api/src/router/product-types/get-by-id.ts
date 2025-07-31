import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { z } from "zod";

import { productTypes } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getById = protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        try {
            const productTypeData = await ctx.db.query.productTypes.findFirst({
                where: eq(productTypes.id, input.id),
            });

            if (!productTypeData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Тип продукта не найден",
                });
            }

            return productTypeData;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось получить тип продукта",
                cause: error,
            });
        }
    }); 