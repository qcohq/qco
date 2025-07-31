import { protectedProcedure } from "../../../trpc";
import { RemoveFromFavoritesSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq } from "@qco/db";
import { favorites } from "@qco/db/schema";

export const removeFromFavorites = protectedProcedure
  .input(RemoveFromFavoritesSchema)
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
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

      if (!favorite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found in favorites",
        });
      }

      // Remove from favorites
      await ctx.db
        .delete(favorites)
        .where(
          and(
            eq(favorites.customerId, userId),
            eq(favorites.productId, input.productId)
          )
        );

      return {
        success: true,
        message: "Product removed from favorites",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove product from favorites",
      });
    }
  });
