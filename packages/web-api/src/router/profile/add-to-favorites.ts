import { eq, and } from '@qco/db';
import { favorites } from '@qco/db/schema';
import { addToFavoritesInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const addToFavorites = protectedProcedure
    .input(addToFavoritesInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Проверяем, не добавлен ли уже товар в избранное
        const existingFavorite = await ctx.db.query.favorites.findFirst({
            where: and(
                eq(favorites.customerId, userId),
                eq(favorites.productId, input.productId)
            ),
        });

        if (existingFavorite) {
            throw new Error('Товар уже добавлен в избранное');
        }

        // Добавляем товар в избранное
        const newFavorite = await ctx.db
            .insert(favorites)
            .values({
                customerId: userId,
                productId: input.productId,
            })
            .returning();

        return newFavorite[0];
    }); 
