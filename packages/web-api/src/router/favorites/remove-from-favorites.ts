import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "@qco/db";
import { favorites } from "@qco/db/schema";

const removeFromFavoritesInput = z.object({
    productId: z.string(),
    guestId: z.string().optional(),
});

export const removeFromFavorites = publicProcedure
    .input(removeFromFavoritesInput)
    .mutation(async ({ ctx, input }) => {
        try {
            let whereCondition;

            if (ctx.session?.user?.id) {
                // Авторизованный пользователь
                whereCondition = and(
                    eq(favorites.customerId, ctx.session.user.id),
                    eq(favorites.productId, input.productId),
                    isNull(favorites.guestId)
                );
            } else if (input.guestId) {
                // Гостевой пользователь
                whereCondition = and(
                    eq(favorites.guestId, input.guestId),
                    eq(favorites.productId, input.productId),
                    isNull(favorites.customerId)
                );
            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Необходима авторизация или guestId",
                });
            }

            const favorite = await ctx.db.query.favorites.findFirst({
                where: whereCondition,
            });

            if (!favorite) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Товар не найден в избранном",
                });
            }

            // Удаляем из избранного
            await ctx.db.delete(favorites).where(whereCondition);

            return {
                success: true,
                message: "Товар удален из избранного",
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось удалить товар из избранного",
            });
        }
    }); 