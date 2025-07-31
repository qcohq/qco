import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../trpc"
import { recentOrdersArraySchema } from "@qco/validators"
import { desc } from "@qco/db"

export const getRecentOrders = protectedProcedure
  .output(recentOrdersArraySchema)
  .query(async ({ ctx }) => {
    try {
      const recentOrders = await ctx.db.query.orders.findMany({
        orderBy: (orders) => [desc(orders.createdAt)],
        limit: 10,
        with: {
          customer: true,
        }
      })

      // Transform data to match the expected schema
      const transformedOrders = recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.firstName && order.customer?.lastName
          ? `${order.customer.firstName} ${order.customer.lastName}`
          : order.customer?.email || 'Unknown Customer',
        amount: Number(order.totalAmount) || 0,
        status: order.status,
        date: order.createdAt.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }))

      return transformedOrders;
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch recent orders",
      });
    }
  });
