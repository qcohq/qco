import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderPaymentStatusUpdateSchema } from "@qco/validators";

export const updatePaymentStatus = protectedProcedure
    .input(orderPaymentStatusUpdateSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, paymentStatus } = input;

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

        // Update payment status
        await ctx.db.update(orders).set({ paymentStatus }).where(eq(orders.id, id));

        return {
            success: true,
            message: `Payment status updated to ${paymentStatus}`,
            customerEmail: customer?.email,
        };
    }); 