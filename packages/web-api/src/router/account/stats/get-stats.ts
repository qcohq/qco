import { protectedProcedure } from "../../../trpc";
import { AccountStatsSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { orders, favorites } from "@qco/db/schema";
import { eq, sql } from "@qco/db";

export const getStats = protectedProcedure
  .output(AccountStatsSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);

      // Получаем статистику заказов
      const orderStats = await ctx.db
        .select({
          totalOrders: sql<number>`count(*)::int`,
          totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)::float`,
          yearSpent: sql<number>`coalesce(sum(case when ${orders.createdAt} >= ${startOfYear} then ${orders.totalAmount} else 0 end), 0)::float`,
        })
        .from(orders)
        .where(eq(orders.customerId, userId));

      // Получаем количество избранных товаров
      const favoritesCount = await ctx.db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(favorites)
        .where(eq(favorites.customerId, userId));

      const { totalOrders, totalSpent, yearSpent } = orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        yearSpent: 0,
      };

      const favoritesTotal = favoritesCount[0]?.count || 0;

      return {
        orders: {
          total: totalOrders,
          yearSpent: yearSpent,
          totalSpent: totalSpent,
        },
        favorites: favoritesTotal,
        bonusPoints: 0, // Пока используем 0, так как нет таблицы бонусных баллов
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch account statistics",
      });
    }
  });
