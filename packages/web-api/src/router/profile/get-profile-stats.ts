import { eq, sql, and, gte } from '@qco/db';
import { orders, favorites } from '@qco/db/schema';
import { protectedProcedure } from '../../trpc';
import { safeLength } from '../../lib/safe-array';

export const getProfileStats = protectedProcedure
    .query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        // Получаем количество активных заказов (не доставленных)
        const activeOrdersCount = await ctx.db
            .select({
                count: sql<number>`count(*)`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.customerId, userId),
                    sql`${orders.status} NOT IN ('delivered', 'cancelled')`
                )
            );

        // Получаем количество избранных товаров
        const favoritesCount = await ctx.db
            .select({
                count: sql<number>`count(*)`,
            })
            .from(favorites)
            .where(eq(favorites.customerId, userId));

        return {
            activeOrders: Number(activeOrdersCount[0]?.count || 0),
            favorites: Number(favoritesCount[0]?.count || 0),
        };
    }); 
