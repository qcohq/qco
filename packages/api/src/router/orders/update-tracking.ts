import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderTrackingUpdateSchema } from "@qco/validators";

export const updateTracking = protectedProcedure
    .input(orderTrackingUpdateSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, trackingNumber, trackingUrl } = input;

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

        // Update tracking info
        const updateData: any = {};
        if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
        if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

        await ctx.db.update(orders).set(updateData).where(eq(orders.id, id));

        return {
            success: true,
            message: "Tracking information updated",
            customerEmail: customer?.email,
        };
    }); 