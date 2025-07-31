import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "@qco/db";
import { favorites, products } from "@qco/db/schema";

const addToFavoritesInput = z.object({
    productId: z.string(),
    guestId: z.string().optional(),
});

export const addToFavorites = publicProcedure
    .input(addToFavoritesInput)
    .mutation(async ({ ctx, input }) => {
        try {
            // Проверяем, существует ли продукт
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.id, input.productId),
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Товар не найден",
                });
            }

            let whereCondition;
            const insertData: any = {
                productId: input.productId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            if (ctx.session?.user?.id) {
                // Авторизованный пользователь
                whereCondition = and(
                    eq(favorites.customerId, ctx.session.user.id),
                    eq(favorites.productId, input.productId),
                    isNull(favorites.guestId)
                );
                insertData.customerId = ctx.session.user.id;
                insertData.guestId = null;
            } else if (input.guestId) {
                // Гостевой пользователь
                whereCondition = and(
                    eq(favorites.guestId, input.guestId),
                    eq(favorites.productId, input.productId),
                    isNull(favorites.customerId)
                );
                insertData.guestId = input.guestId;
                insertData.customerId = null;
            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Необходима авторизация или guestId",
                });
            }

            // Проверяем, добавлен ли уже товар в избранное
            const existingFavorite = await ctx.db.query.favorites.findFirst({
                where: whereCondition,
            });

            if (existingFavorite) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Товар уже добавлен в избранное",
                });
            }

            // Добавляем товар в избранное
            await ctx.db.insert(favorites).values(insertData);

            return {
                success: true,
                message: "Товар добавлен в избранное",
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось добавить товар в избранное",
            });
        }
    }); 