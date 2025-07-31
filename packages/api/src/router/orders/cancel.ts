import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderCancelSchema } from "@qco/validators";

export const cancel = protectedProcedure
    .input(orderCancelSchema)
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

        // Update order status to cancelled
        await ctx.db.update(orders).set({
            status: "cancelled",
            cancelledAt: new Date(),
        }).where(eq(orders.id, id));

        return {
            success: true,
            message: "Order cancelled successfully",
            customerEmail: customer?.email,
        };
    }); 
