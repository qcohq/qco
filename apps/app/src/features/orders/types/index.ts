import { z } from "zod";

// Схемы для валидации данных заказов

// Схема для элемента заказа
export const orderItemSchema = z.object({
    id: z.string(),
    productSku: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
    productName: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
});

// Схема для заказа
export const orderSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    orderNumber: z.string().optional(),
    customerName: z.string(),
    customerId: z.string().optional(),
    orderDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    totalAmount: z.number().min(0),
    orderStatus: z.string(),
    status: z.string(),
    paymentMethod: z.string(),
    paymentStatus: z.string().optional(),
    shippingMethod: z.string().optional(),
    shippingAmount: z.number().optional(),
    deliveryMethod: z.string().optional(),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().optional(),
    items: z.array(orderItemSchema),
    metadata: z.record(z.any()).optional(),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }).optional(),
});

// Схема для создания заказа
export const createOrderSchema = z.object({
    customerId: z.string(),
    items: z.array(z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1),
        price: z.number().min(0),
    })),
    paymentMethod: z.string(),
    shippingMethod: z.string(),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }),
});

// Схема для обновления заказа
export const updateOrderSchema = z.object({
    id: z.string(),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().optional(),
    shippingAddress: z.object({
        street: z.string(),
        city: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }).optional(),
});

// Схема для фильтрации заказов
export const orderFilterSchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    customerId: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
});

// Схема для массового удаления заказов
export const bulkDeleteOrdersSchema = z.object({
    orderIds: z.array(z.string()),
});

// Схема для добавления товара в заказ
export const addOrderItemSchema = z.object({
    orderId: z.string(),
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
});

// Схема для обновления статуса доставки
export const updateDeliveryStatusSchema = z.object({
    id: z.string(),
    status: z.string(),
});

// Схема для обновления информации об отслеживании
export const updateTrackingSchema = z.object({
    id: z.string(),
    trackingNumber: z.string().optional(),
    trackingUrl: z.string().optional(),
});

// Экспорт типов
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderData = z.infer<typeof updateOrderSchema>;
export type OrderFilterData = z.infer<typeof orderFilterSchema>;
export type BulkDeleteOrdersData = z.infer<typeof bulkDeleteOrdersSchema>;
export type AddOrderItemData = z.infer<typeof addOrderItemSchema>;
export type UpdateDeliveryStatusData = z.infer<typeof updateDeliveryStatusSchema>;
export type UpdateTrackingData = z.infer<typeof updateTrackingSchema>;

// Экспорт схем
export {
    orderItemSchema,
    orderSchema,
    createOrderSchema,
    updateOrderSchema,
    orderFilterSchema,
    bulkDeleteOrdersSchema,
    addOrderItemSchema,
    updateDeliveryStatusSchema,
    updateTrackingSchema,
}; 