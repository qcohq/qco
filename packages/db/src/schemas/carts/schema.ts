import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "../products";
import { customers } from "../customers";

// Таблица корзин
export const carts = pgTable("carts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),
  sessionId: varchar("session_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  metadata: jsonb("metadata"),
});

// Таблица элементов корзины
export const cartItems = pgTable("cart_items", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, {
      onDelete: "cascade",
    }),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),
  variantId: text("variant_id"),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountedPrice: decimal("discounted_price", { precision: 10, scale: 2 }),
  attributes: jsonb("attributes").$type<{
    size?: string;
    color?: string;
    [key: string]: any;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Таблица скидочных купонов для корзины
export const cartCoupons = pgTable("cart_coupons", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id, {
      onDelete: "cascade",
    }),
  code: varchar("code", { length: 100 }).notNull(),
  discountType: varchar("discount_type", { length: 50 }).notNull(), // percentage, fixed_amount
  discountValue: decimal("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
});

// Отношения для таблицы корзин
export const cartsRelations = relations(carts, ({ many, one }) => ({
  items: many(cartItems),
  coupons: many(cartCoupons),
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
}));

// Отношения для таблицы элементов корзины
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// Отношения для таблицы купонов корзины
export const cartCouponsRelations = relations(cartCoupons, ({ one }) => ({
  cart: one(carts, {
    fields: [cartCoupons.cartId],
    references: [carts.id],
  }),
}));
