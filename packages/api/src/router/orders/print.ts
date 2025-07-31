import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { orders, orderItems, customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { orderPrintSchema } from "@qco/validators";

export const printOrder = protectedProcedure
    .input(orderPrintSchema)
    .query(async ({ ctx, input }) => {
        const { id } = input;

        const order = await ctx.db.query.orders.findFirst({
            where: eq(orders.id, id),
            with: {
                items: {
                    with: {
                        product: true,
                        variant: true,
                    },
                },
                customer: true,
            },
        });

        if (!order) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Order not found",
            });
        }

        const customer = await ctx.db.query.customers.findFirst({
            where: eq(customers.id, order.customerId),
        });

        if (!customer) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Customer not found",
            });
        }

        return {
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                taxAmount: order.taxAmount,
                shippingAmount: order.shippingAmount,
                discountAmount: order.discountAmount,
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                cancelledAt: order.cancelledAt?.toISOString() || null,
                items: order.items?.map(item => ({
                    id: item.id,
                    productName: item.productName,
                    productSku: item.productSku,
                    variantName: item.variantName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    attributes: item.attributes,
                })) || [],
            },
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
            },
        };
    }); 
