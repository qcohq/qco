import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, orderItems, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderRemoveSchema } from "@qco/validators";

export const removeOrder = protectedProcedure
  .input(orderRemoveSchema)
  .mutation(async ({ ctx, input }) => {
    const { id } = input;

    // Check if order exists
    const order = await ctx.db.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found",
      });
    }

    // Get customer info for notification
    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, order.customerId),
    });

    // Delete order items first
    await ctx.db.delete(orderItems).where(eq(orderItems.orderId, id));

    // Delete the order
    await ctx.db.delete(orders).where(eq(orders.id, id));

    return {
      success: true,
      message: `Order ${order.orderNumber} has been removed`,
      customerEmail: customer?.email,
    };
  });
