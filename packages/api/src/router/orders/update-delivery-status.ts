import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { orders } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderStatusUpdateSchema } from "@qco/validators";

export const updateDeliveryStatus = protectedProcedure
    .input(orderStatusUpdateSchema)
    .mutation(async ({ input, ctx }) => {
        const { id, status } = input;

        const updatedOrder = await ctx.db
            .update(orders)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, id))
            .returning();

        if (!updatedOrder.length) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Order not found",
            });
        }

        return updatedOrder[0];
    }); 