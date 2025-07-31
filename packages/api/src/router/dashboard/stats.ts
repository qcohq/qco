import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../trpc"
import { statsSchema } from "@qco/validators"
import { and, eq, gte, sql } from "@qco/db"
import { customers, orders, products } from "@qco/db/schema"

export const stats = protectedProcedure
  .output(statsSchema)
  .query(async ({ ctx }) => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(now.getMonth() - 2);

      // Get orders for the current month
      const currentMonthOrders = await ctx.db.query.orders.findMany({
        where: and(gte(orders.createdAt, oneMonthAgo)),
        with: {
          items: true,
        },
      });

      // Get orders for the previous month to calculate trend
      const previousMonthOrders = await ctx.db.query.orders.findMany({
        where: and(
          gte(orders.createdAt, twoMonthsAgo),
          sql`${orders.createdAt} < ${oneMonthAgo}`,
        ),
        with: {
          items: true,
        },
      });

      // Calculate total revenue for the current month
      const currentRevenue = currentMonthOrders.reduce((total, order) => {
        const orderTotal = order.items.reduce(
          (sum, item) => sum + Number(item.unitPrice) * item.quantity,
          0,
        );
        return total + orderTotal;
      }, 0);

      // Calculate total revenue for the previous month
      const previousRevenue = previousMonthOrders.reduce((total, order) => {
        const orderTotal = order.items.reduce(
          (sum, item) => sum + Number(item.unitPrice) * item.quantity,
          0,
        );
        return total + orderTotal;
      }, 0);

      // Calculate revenue trend (in percentage)
      const revenueTrend =
        previousRevenue === 0
          ? 100
          : Math.round(
            ((currentRevenue - previousRevenue) / previousRevenue) * 100,
          );

      // Get total number of active products
      const totalProducts = await ctx.db.query.products.findMany({
        where: eq(products.isActive, true),
      });

      // Get number of products added in the last month
      const newProducts = await ctx.db.query.products.findMany({
        where: and(
          eq(products.isActive, true),
          gte(products.createdAt, oneMonthAgo),
        ),
      });

      // Calculate products trend
      const productsTrend =
        totalProducts.length === 0
          ? 0
          : Math.round((newProducts.length / totalProducts.length) * 100);

      // Get total number of customers
      const totalCustomers = await ctx.db.query.customers.findMany();

      // Get number of customers added in the last month
      const newCustomers = await ctx.db.query.customers.findMany({
        where: gte(customers.createdAt, oneMonthAgo),
      });

      // Calculate customers trend
      const customersTrend =
        totalCustomers.length === 0
          ? 0
          : Math.round((newCustomers.length / totalCustomers.length) * 100);

      return {
        revenue: {
          value: currentRevenue,
          trend: revenueTrend,
        },
        orders: {
          value: currentMonthOrders.length,
          trend:
            previousMonthOrders.length === 0
              ? 100
              : Math.round(
                ((currentMonthOrders.length - previousMonthOrders.length) /
                  previousMonthOrders.length) *
                100,
              ),
        },
        products: {
          value: totalProducts.length,
          trend: productsTrend,
        },
        customers: {
          value: totalCustomers.length,
          trend: customersTrend,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard stats",
      });
    }
  });
