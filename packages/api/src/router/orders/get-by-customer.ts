import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

import { orders, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { getOrdersByCustomerSchema, getOrdersByCustomerOutputSchema } from "@qco/validators";

export const getByCustomer = protectedProcedure
    .input(getOrdersByCustomerSchema)
    .output(getOrdersByCustomerOutputSchema)
    .query(async ({ ctx, input }) => {
        const { customerId, page = 1, limit = 10, status } = input;

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

        // Build where conditions
        const whereConditions = [eq(orders.customerId, customerId)];
        if (status) {
            whereConditions.push(eq(orders.status, status));
        }

        // Get orders
        const ordersList = await ctx.db.query.orders.findMany({
            where: whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
            limit,
            offset: (page - 1) * limit,
            with: {
                customer: true,
            },
        });

        // Get total count
        const totalCount = await ctx.db.query.orders.findMany({
            where: whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
        });

        return {
            orders: ordersList.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                cancelledAt: order.cancelledAt?.toISOString() || null,
            })),
            total: totalCount.length,
            hasMore: totalCount.length > page * limit,
        };
    }); 
