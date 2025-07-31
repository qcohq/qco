import { eq, and } from '@qco/db';
import { favorites } from '@qco/db/schema';
import { removeFromFavoritesInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const removeFromFavorites = protectedProcedure
    .input(removeFromFavoritesInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Удаляем товар из избранного
        await ctx.db
            .delete(favorites)
            .where(
                and(
                    eq(favorites.customerId, userId),
                    eq(favorites.productId, input.productId)
                )
            );

        return { success: true };
    }); 
