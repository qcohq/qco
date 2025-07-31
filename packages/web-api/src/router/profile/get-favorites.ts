import { eq, desc } from '@qco/db';
import { favorites } from '@qco/db/schema';
import { getFavoritesInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';
import { safeMap } from '../../lib/safe-array';

export const getFavorites = protectedProcedure
    .input(getFavoritesInput)
    .query(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const favoritesData = await ctx.db.query.favorites.findMany({
            where: eq(favorites.customerId, userId),
            orderBy: [desc(favorites.createdAt)],
            limit: input.limit,
            offset: input.offset,
            with: {
                product: {
                    with: {
                        variants: true,
                        files: {
                            with: {
                                file: true,
                            },
                        },
                    },
                },
            },
        });

        return safeMap(favoritesData, (favorite: any) => ({
            id: favorite.id,
            productId: favorite.productId,
            createdAt: favorite.createdAt,
            product: {
                ...favorite.product,
                images: favorite.product?.files
                    ?.filter((file: any) => file.file?.url)
                    ?.map((file: any) => file.file.url) || [],
            },
        }));
    }); 
