import { z } from "zod";
import {
	OrderStatus,
	PaymentMethod,
	ShippingMethod,
	PaymentStatus,
} from "@qco/db/schema";

/**
 * Order History Schema
 */
export const orderHistorySchema = z.object({
	id: z.string(),
	orderId: z.string(),
	status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
	comment: z.string().nullable(),
	createdAt: z.iso.datetime(),
});

/**
 * Order Item Schema
 */
export const orderItemSchema = z.object({
	id: z.string().optional(),
	orderId: z.string().optional(),
	productId: z.string(),
	variantId: z.string().nullable().optional(),
	productName: z.string(),
	productSku: z.string().optional(),
	variantName: z.string().optional(),
	quantity: z.number().int().min(1),
	unitPrice: z.string(), // decimal as string
	totalPrice: z.string(), // decimal as string

	createdAt: z.iso.datetime().optional(),
});

/**
 * Order Create Schema
 */
export const orderCreateSchema = z.object({
	customerId: z.string(),
	items: z.array(z.object({
		productId: z.string(),
		variantId: z.string().optional(),
		quantity: z.number(),
		unitPrice: z.string(),
		totalPrice: z.string(),
		productName: z.string(),
		productSku: z.string().optional(),
		variantName: z.string().optional(),

	})),
	totalAmount: z.string(),
	subtotalAmount: z.string(),
	taxAmount: z.string(),
	shippingAmount: z.string(),
	discountAmount: z.string(),
	paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]]).optional(),
	paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]]).optional(),
	shippingMethod: z.enum(Object.values(ShippingMethod) as [string, ...string[]]).optional(),
	shippingAddressId: z.string().nullable().optional(),
	trackingNumber: z.string().optional(),
	notes: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Order Status Update Schema
 */
export const orderStatusUpdateSchema = z.object({
	id: z.string(),
	status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
});

/**
 * Order Payment Status Update Schema
 */
export const orderPaymentStatusUpdateSchema = z.object({
	id: z.string(),
	paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
});

/**
 * Order Tracking Update Schema
 */
export const orderTrackingUpdateSchema = z.object({
	id: z.string(),
	trackingNumber: z.string().optional(),
	trackingUrl: z.string().url().optional(),
});

/**
 * Order Cancel Schema
 */
export const orderCancelSchema = z.object({
	id: z.string(),
	reason: z.string().optional(),
});

/**
 * Order Print Schema
 */
export const orderPrintSchema = z.object({
	id: z.string(),
});

/**
 * Order Remove Schema
 */
export const orderRemoveSchema = z.object({
	id: z.string(),
});

/**
 * Get Order By ID Schema
 */
export const getOrderByIdSchema = z.object({
	id: z.string(),
});

/**
 * Get Orders By Customer Schema
 */
export const getOrdersByCustomerSchema = z.object({
	customerId: z.string(),
	page: z.number().default(1),
	limit: z.number().default(10),
	status: z.enum(Object.values(OrderStatus) as [string, ...string[]]).optional(),
});

/**
 * Get Orders By Customer Output Schema
 */
export const getOrdersByCustomerOutputSchema = z.object({
	orders: z.array(z.object({
		id: z.string(),
		orderNumber: z.string(),
		status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
		totalAmount: z.string(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
		cancelledAt: z.iso.datetime().nullable().optional(),
	})),
	total: z.number(),
	hasMore: z.boolean(),
});

/**
 * Order List Schema
 */
export const orderListSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
});

/**
 * Order Schema (для вывода)
 */
export const orderSchema = z.object({
	id: z.string(),
	orderNumber: z.string(),
	status: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
	subtotalAmount: z.string(),
	totalAmount: z.string(),
	taxAmount: z.string(),
	shippingAmount: z.string(),
	discountAmount: z.string(),
	paymentMethod: z.enum(Object.values(PaymentMethod) as [string, ...string[]]).optional(),
	paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]]).optional(),
	shippingMethod: z.enum(Object.values(ShippingMethod) as [string, ...string[]]).optional(),
	customerId: z.string(),
	shippingAddressId: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	trackingNumber: z.string().nullable().optional(),
	trackingUrl: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	confirmedAt: z.date().nullable().optional(),
	shippedAt: z.date().nullable().optional(),
	deliveredAt: z.date().nullable().optional(),
	cancelledAt: z.date().nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
	items: z.array(z.object({
		id: z.string(),
		orderId: z.string(),
		productId: z.string(),
		variantId: z.string().nullable(),
		productName: z.string(),
		productSku: z.string().nullable(),
		variantName: z.string().nullable(),
		quantity: z.number(),
		unitPrice: z.string(),
		totalPrice: z.string(),

		createdAt: z.date(),
		slug: z.string().nullable(),
		image: z.string().nullable(),
		// Дополнительная информация о варианте
		variantSku: z.string().nullable().optional(),
		variantBarcode: z.string().nullable().optional(),
		variantPrice: z.string().nullable().optional(),
		variantSalePrice: z.string().nullable().optional(),
		variantStock: z.number().nullable().optional(),
		variantWeight: z.string().nullable().optional(),
		variantDimensions: z.object({
			width: z.string().nullable().optional(),
			height: z.string().nullable().optional(),
			depth: z.string().nullable().optional(),
		}).nullable().optional(),
		// Опции варианта товара
		variantOptions: z.array(z.object({
			name: z.string(), // Название опции (например, "Размер", "Цвет")
			value: z.string(), // Значение опции (например, "L", "Красный")
			slug: z.string(), // Слаг опции (например, "size", "color")
		})).nullable().optional(),
	})),
	customer: z.object({
		id: z.string(),
		customerCode: z.string(),
		name: z.string().nullable(),
		firstName: z.string().nullable(),
		lastName: z.string().nullable(),
		email: z.string(),
		emailVerified: z.boolean(),
		phone: z.string().nullable(),
		dateOfBirth: z.date().nullable(),
		gender: z.string().nullable(),
		image: z.string().nullable(),
		isGuest: z.boolean(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}).optional(),
});

/**
 * Customer Info Schema
 */
export const customerInfoSchema = z.object({
	id: z.string(),
	name: z.string().nullable(),
	email: z.string(),
	phone: z.string().nullable().optional(),
});

/**
 * Order with Customer Schema
 */
export const orderWithCustomerSchema = z.object({
	order: orderSchema,
	customer: z.object({
		id: z.string(),
		customerCode: z.string(),
		name: z.string().nullable(),
		firstName: z.string().nullable(),
		lastName: z.string().nullable(),
		email: z.string(),
		emailVerified: z.boolean(),
		phone: z.string().nullable(),
		dateOfBirth: z.date().nullable(),
		gender: z.string().nullable(),
		image: z.string().nullable(),
		isGuest: z.boolean(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
});

/**
 * Order Statistics Schema
 */
export const orderStatsSchema = z.object({
	total: z.number(),
	totalLast24h: z.number(),
	byStatus: z.object({
		pending: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		confirmed: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		processing: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		shipped: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		delivered: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		cancelled: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
		refunded: z.object({
			count: z.number(),
			last24h: z.number(),
		}),
	}),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export type OrderPaymentStatusUpdateInput = z.infer<typeof orderPaymentStatusUpdateSchema>;
export type OrderTrackingUpdateInput = z.infer<typeof orderTrackingUpdateSchema>;
export type OrderCancelInput = z.infer<typeof orderCancelSchema>;
export type OrderPrintInput = z.infer<typeof orderPrintSchema>;
export type OrderRemoveInput = z.infer<typeof orderRemoveSchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type GetOrdersByCustomerInput = z.infer<typeof getOrdersByCustomerSchema>;
export type GetOrdersByCustomerOutput = z.infer<typeof getOrdersByCustomerOutputSchema>;
export type OrderListInput = z.infer<typeof orderListSchema>;
export type OrderOutput = z.infer<typeof orderSchema>;
export type OrderWithCustomerOutput = z.infer<typeof orderWithCustomerSchema>;
export type OrderStatsOutput = z.infer<typeof orderStatsSchema>;
export type OrderHistoryOutput = z.infer<typeof orderHistorySchema>;
