import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { products } from "../products";
import { customers } from "../customers"

// Таблица избранных товаров
export const favorites = pgTable("favorites", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // ID продукта (обязательное поле)
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  // ID пользователя (опциональное поле для неавторизованных пользователей)
  customerId: text("customer_id")
    .references(() => customers.id, { onDelete: "cascade" }),

  // Уникальный идентификатор для неавторизованных пользователей
  // (например, session ID или device fingerprint)
  guestId: varchar("guest_id", { length: 255 }),

  // IP адрес для дополнительной идентификации
  ipAddress: varchar("ip_address", { length: 45 }),

  // User Agent для дополнительной идентификации
  userAgent: text("user_agent"),

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Индексы для оптимизации запросов
  productIdx: index("favorite_product_idx").on(table.productId),
  customerIdx: index("favorite_customer_idx").on(table.customerId),
  guestIdx: index("favorite_guest_idx").on(table.guestId),
  // Составной индекс для быстрого поиска избранных товаров пользователя
  customerProductIdx: index("favorite_customer_product_idx").on(
    table.customerId,
    table.productId
  ),
  // Составной индекс для гостевых избранных товаров
  guestProductIdx: index("favorite_guest_product_idx").on(
    table.guestId,
    table.productId
  ),
}));

// Определение отношений
export const favoritesRelations = relations(favorites, ({ one }) => ({
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [favorites.customerId],
    references: [customers.id],
  }),
}));

// Типы для TypeScript
export type FavoriteType = typeof favorites.$inferSelect;
export type NewFavoriteType = typeof favorites.$inferInsert;
