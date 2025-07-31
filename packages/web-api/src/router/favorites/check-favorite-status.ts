import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "@qco/db";
import { favorites } from "@qco/db/schema";

const checkFavoriteStatusInput = z.object({
    productId: z.string(),
    guestId: z.string().optional(),
});

export const checkFavoriteStatus = publicProcedure
    .input(checkFavoriteStatusInput)
    .query(async ({ ctx, input }) => {
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
                // Нет идентификации - товар не в избранном
                return {
                    isFavorite: false,
                    favoriteId: null,
                };
            }

            const favorite = await ctx.db.query.favorites.findFirst({
                where: whereCondition,
            });

            return {
                isFavorite: !!favorite,
                favoriteId: favorite?.id || null,
            };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to check favorite status",
            });
        }
    }); 