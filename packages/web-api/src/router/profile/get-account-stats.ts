import { eq, desc, sql, and, gte } from '@qco/db';
import { orders, favorites } from '@qco/db/schema';
import { getAccountStatsInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const getAccountStats = protectedProcedure
    .input(getAccountStatsInput)
    .query(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Определяем период для статистики
        const now = new Date();
        let startDate: Date;

        switch (input.period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
            default:
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }

        // Получаем статистику заказов
        const ordersStats = await ctx.db
            .select({
                total: sql<number>`count(*)`,
                totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.customerId, userId),
                    gte(orders.createdAt, startDate)
                )
            );

        // Получаем количество избранных товаров
        const favoritesCount = await ctx.db
            .select({
                count: sql<number>`count(*)`,
            })
            .from(favorites)
            .where(eq(favorites.customerId, userId));

        // Получаем статистику за весь год для сравнения
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearStats = await ctx.db
            .select({
                yearSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
            })
            .from(orders)
            .where(
                and(
                    eq(orders.customerId, userId),
                    gte(orders.createdAt, yearStart)
                )
            );

        return {
            orders: {
                total: Number(ordersStats[0]?.total || 0),
                yearSpent: Number(yearStats[0]?.yearSpent || 0),
            },
            favorites: Number(favoritesCount[0]?.count || 0),
            bonusPoints: Math.floor(Number(yearStats[0]?.yearSpent || 0) / 100), // 1 балл за каждые 100 рублей
        };
    }); 
