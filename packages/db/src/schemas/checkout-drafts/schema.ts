import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { customers } from "../customers";

/**
 * Таблица черновиков оформления заказа
 * Используется для автосохранения данных формы оформления заказа
 */
export const checkoutDrafts = pgTable("checkout_drafts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Связь с клиентом (если пользователь авторизован)
  customerId: text("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),

  // Идентификатор сессии (для неавторизованных пользователей)
  sessionId: text("session_id"),

  // Данные формы оформления заказа в формате JSON
  draftData: jsonb("draft_data").notNull(),

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  customerIdx: index("checkout_drafts_customer_idx").on(table.customerId),
  sessionIdx: index("checkout_drafts_session_idx").on(table.sessionId),
  updatedIdx: index("checkout_drafts_updated_idx").on(table.updatedAt),
}));

// Определение отношений
export const checkoutDraftsRelations = relations(checkoutDrafts, ({ one }) => ({
  customer: one(customers, {
    fields: [checkoutDrafts.customerId],
    references: [customers.id],
  }),
}));

// Типы для TypeScript
export type CheckoutDraft = typeof checkoutDrafts.$inferSelect;
export type NewCheckoutDraft = typeof checkoutDrafts.$inferInsert;
