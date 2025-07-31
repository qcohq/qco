import { protectedProcedure } from "../../trpc";
import { orders } from "@qco/db/schema";
import { eq, and, gte } from "@qco/db";
import { orderStatsSchema } from "@qco/validators";

/**
 * Returns order statistics including counts by status and changes in last 24 hours
 */
export const stats = protectedProcedure
	.output(orderStatsSchema)
	.query(async ({ ctx }) => {
		// Get current date and 24 hours ago
		const now = new Date();
		const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		// Get total orders count
		const totalOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders);

		// Get orders count by status - используем все возможные статусы из enum
		const pendingOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "pending"));

		const confirmedOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "confirmed"));

		const processingOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "processing"));

		const shippedOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "shipped"));

		const deliveredOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "delivered"));

		const cancelledOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "cancelled"));

		const refundedOrders = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(eq(orders.status, "refunded"));

		// Get orders created in last 24 hours
		const ordersLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(gte(orders.createdAt, twentyFourHoursAgo));

		// Get orders by status created in last 24 hours
		const pendingLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "pending"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const confirmedLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "confirmed"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const processingLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "processing"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const shippedLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "shipped"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const deliveredLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "delivered"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const cancelledLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "cancelled"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		const refundedLast24h = await ctx.db
			.select({ count: orders.id })
			.from(orders)
			.where(
				and(
					eq(orders.status, "refunded"),
					gte(orders.createdAt, twentyFourHoursAgo)
				)
			);

		return {
			total: totalOrders.length,
			totalLast24h: ordersLast24h.length,
			byStatus: {
				pending: {
					count: pendingOrders.length,
					last24h: pendingLast24h.length,
				},
				confirmed: {
					count: confirmedOrders.length,
					last24h: confirmedLast24h.length,
				},
				processing: {
					count: processingOrders.length,
					last24h: processingLast24h.length,
				},
				shipped: {
					count: shippedOrders.length,
					last24h: shippedLast24h.length,
				},
				delivered: {
					count: deliveredOrders.length,
					last24h: deliveredLast24h.length,
				},
				cancelled: {
					count: cancelledOrders.length,
					last24h: cancelledLast24h.length,
				},
				refunded: {
					count: refundedOrders.length,
					last24h: refundedLast24h.length,
				},
			},
		};
	}); 
