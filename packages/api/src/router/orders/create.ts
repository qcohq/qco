import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, orderItems, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderCreateSchema } from "@qco/validators";

export const create = protectedProcedure
  .input(orderCreateSchema)
  .mutation(async ({ ctx, input }) => {
    const { customerId, items, ...orderData } = input;

    // Check if customer exists
    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, customerId),
    });

    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found",
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const [order] = await ctx.db.insert(orders).values({
      customerId,
      orderNumber,
      status: "pending",
      paymentStatus: orderData.paymentStatus || "PENDING",
      ...orderData,
    }).returning();

    if (!order) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create order",
      });
    }

    // Create order items
    for (const item of items) {
      await ctx.db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        productName: item.productName,
        productSku: item.productSku,
        variantName: item.variantName,

      });
    }

    return order;
  });
