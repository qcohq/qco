import { z } from "zod";
import { basicCartWithItemsSchema } from "./cart";

/**
 * Схема для информации о клиенте
 */
export const customerInfoSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  company: z.string().optional(),
  address: z.string().min(1),
  apartment: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  saveAddress: z.boolean().optional(),
  saveToProfile: z.boolean().optional(), // Новое поле для сохранения в профиль
});

/**
 * Схема для способа доставки
 */
export const shippingMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  estimatedDelivery: z.string(),
  deliveryDate: z.date().optional(),
  deliveryTimeSlot: z.string().optional(),
  deliveryInstructions: z.string().optional(),
});

/**
 * Схема для способа оплаты
 */
export const paymentMethodSchema = z.object({
  id: z.string(),
  type: z.enum(["credit_card", "bank_transfer", "cash_on_delivery", "digital_wallet"]),
  name: z.string(),
  description: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  savePayment: z.boolean().optional(),
});

/**
 * Схема для создания заказа
 */
export const createOrderSchema = z.object({
  cartId: z.string(),
  customerInfo: customerInfoSchema,
  shippingMethod: shippingMethodSchema,
  paymentMethod: paymentMethodSchema,
  createProfile: z.boolean().optional(), // Новое поле для создания профиля
});

/**
 * Схема для получения заказа по ID
 */
export const getOrderByIdSchema = z.object({
  orderId: z.string(),
});

// Enum для статуса заказа (соответствует БД)
export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Enum для статуса оплаты (соответствует БД)
export const paymentStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

// Схема для элемента заказа
export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  variantId: z.string().nullable(),
  productName: z.string(),
  productSku: z.string().nullable(),
  variantName: z.string().nullable(),
  quantity: z.number(),
  unitPrice: z.number(), // decimal в БД, но возвращается как number
  totalPrice: z.number(), // decimal в БД, но возвращается как number
  attributes: z.record(z.string(), z.unknown()).nullable(), // JSON в БД
  createdAt: z.date(),
  // Дополнительная информация о варианте
  variantSku: z.string().nullable().optional(),
  variantBarcode: z.string().nullable().optional(),
  variantPrice: z.number().nullable().optional(),
  variantSalePrice: z.number().nullable().optional(),
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
});

/**
 * Схема для заказа
 */
export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: orderStatusSchema,
  subtotalAmount: z.number(), // decimal в БД, но возвращается как number
  shippingAmount: z.number(), // decimal в БД, но возвращается как number
  discountAmount: z.number(), // decimal в БД, но возвращается как number
  taxAmount: z.number(), // decimal в БД, но возвращается как number
  totalAmount: z.number(), // decimal в БД, но возвращается как number
  paymentMethod: paymentMethodSchema.optional(),
  shippingMethod: shippingMethodSchema.optional(),
  customerId: z.string(),
  shippingAddressId: z.string().nullable(),
  notes: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  trackingUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  confirmedAt: z.date().nullable(),
  shippedAt: z.date().nullable(),
  deliveredAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  // Метаданные заказа (JSONB в БД)
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  // Вычисляемые поля для фронтенда
  customerInfo: customerInfoSchema.optional(),
  items: z.array(orderItemSchema),
});

/**
 * Расширенная схема для заказа с дополнительными полями для API
 */
export const webOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: orderStatusSchema,
  customerInfo: customerInfoSchema,
  shippingMethod: shippingMethodSchema,
  paymentMethod: paymentMethodSchema,
  cart: basicCartWithItemsSchema,
  subtotal: z.number(),
  shippingCost: z.number(),
  total: z.number(),
  paymentStatus: z.string(),
  notes: z.string().optional(),
});

// Типы на основе схем
export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type ShippingMethod = z.infer<typeof shippingMethodSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type WebOrder = z.infer<typeof webOrderSchema>;
