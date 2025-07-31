import { protectedProcedure } from "../../../trpc";
import { FavoriteProductsSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { eq, desc } from '@qco/db';
import { favorites } from '@qco/db/schema';

export const getFavorites = protectedProcedure
  .output(FavoriteProductsSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const favoritesData = await ctx.db.query.favorites.findMany({
        where: eq(favorites.customerId, userId),
        orderBy: [desc(favorites.createdAt)],
      });

      return favoritesData.map((favorite) => ({
        id: favorite.id,
        productId: favorite.productId,
        customerId: favorite.customerId,
        guestId: favorite.guestId,
        ipAddress: favorite.ipAddress,
        userAgent: favorite.userAgent,
        createdAt: favorite.createdAt,
        updatedAt: favorite.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch favorites",
      });
    }
  });
