import { protectedProcedure } from "../../../trpc";
import { CheckFavoriteStatusSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq } from "@qco/db";
import { favorites } from "@qco/db/schema";

export const checkFavoriteStatus = protectedProcedure
    .input(CheckFavoriteStatusSchema)
    .output(
        z.object({
            isFavorite: z.boolean(),
            favoriteId: z.string().nullable(),
        }),
    )
    .query(async ({ ctx, input }) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        try {
            const favorite = await ctx.db.query.favorites.findFirst({
                where: and(
                    eq(favorites.customerId, userId),
                    eq(favorites.productId, input.productId)
                ),
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