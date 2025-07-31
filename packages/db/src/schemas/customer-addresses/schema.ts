import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  customers

} from "../customers";
// Таблица адресов клиентов
export const customerAddresses = pgTable("customer_addresses", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Связь с клиентом
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),

  // Тип адреса
  type: varchar("type", { length: 50 }).notNull(), // shipping, both

  // Основная информация
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 20 }),

  // Адрес
  addressLine1: varchar("address_line1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),

  // Дополнительная информация
  isDefault: boolean("is_default").notNull().default(false),
  notes: text("notes"),

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  customerIdx: index("customer_addresses_customer_idx").on(table.customerId),
  typeIdx: index("customer_addresses_type_idx").on(table.type),
  defaultIdx: index("customer_addresses_default_idx").on(table.isDefault),
}));

// Определение отношений
export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
  customer: one(customers, {
    fields: [customerAddresses.customerId],
    references: [customers.id],
  }),
}));

// Типы для TypeScript
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;
