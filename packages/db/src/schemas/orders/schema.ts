import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { products } from "../products";
import { productVariants } from "../products/variants";
import { customers } from '../customers'
// Enum для статуса заказа
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Enum для статуса оплаты
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);



// Enum для способа оплаты
export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "bank_transfer",
  "cash_on_delivery",
  "digital_wallet",
]);

// Enum для способа доставки
export const shippingMethodEnum = pgEnum("shipping_method", [
  "standard",
  "express",
  "pickup",
  "same_day",
]);

// Таблица заказов
export const orders = pgTable("orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Основная информация
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("PENDING"),

  // Финансовая информация
  subtotalAmount: decimal("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

  // Способы оплаты и доставки
  paymentMethod: paymentMethodEnum("payment_method"),
  shippingMethod: shippingMethodEnum("shipping_method"),

  // Информация о клиенте
  customerId: text("customer_id").notNull().references(() => customers.id, {
    onDelete: "restrict",
  }),

  // Адрес доставки
  shippingAddressId: text("shipping_address_id"),

  // Дополнительная информация
  notes: text("notes"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  trackingUrl: varchar("tracking_url", { length: 500 }),
  metadata: jsonb("metadata"), // JSON с дополнительными данными (customerInfo, billingAddress и т.д.)

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
}, (table) => ({
  customerIdx: index("orders_customer_idx").on(table.customerId),
  statusIdx: index("orders_status_idx").on(table.status),
  orderNumberIdx: index("orders_number_idx").on(table.orderNumber),
  createdAtIdx: index("orders_created_idx").on(table.createdAt),
}));

// Таблица элементов заказа
export const orderItems = pgTable("order_items", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Связи
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),
  variantId: text("variant_id").references(() => productVariants.id),

  // Информация о товаре
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSku: varchar("product_sku", { length: 100 }),
  variantName: varchar("variant_name", { length: 255 }),

  // Количество и цены
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),

  // Дополнительная информация
  attributes: jsonb("attributes"), // JSON с атрибутами варианта

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  orderIdx: index("order_items_order_idx").on(table.orderId),
  productIdx: index("order_items_product_idx").on(table.productId),
}));

// Таблица истории статусов заказа
export const orderStatusHistory = pgTable("order_status_history", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  status: orderStatusEnum("status").notNull(),
  comment: text("comment"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  orderIdx: index("order_status_history_order_idx").on(table.orderId),
  createdAtIdx: index("order_status_history_created_idx").on(table.createdAt),
}));

// Определение отношений
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
}));

// Экспорт типов
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type NewOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
