import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { orders } from "../orders";
import { favorites } from "../favorites";
import { customerAddresses } from "../customer-addresses";

export const customerAccounts = pgTable("customer_accounts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export const customerAccountsRelations = relations(
  customerAccounts,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerAccounts.userId],
      references: [customers.id],
    }),
  }),
);

export const customerSessions = pgTable("customer_sessions", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
});

export const customerSessionsRelations = relations(
  customerSessions,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerSessions.userId],
      references: [customers.id],
    }),
  }),
);

export const customerVerifications = pgTable("customer_verifications", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerCode: varchar("customer_code", { length: 20 }).unique().notNull(),
  name: varchar("name", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  image: varchar("image", { length: 255 }),
  isGuest: boolean("is_guest").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const customersRelations = relations(customers, ({ many }) => ({
  accounts: many(customerAccounts),
  sessions: many(customerSessions),
  addresses: many(customerAddresses),
  orders: many(orders),
  favorites: many(favorites),
}));

export type CustomerType = typeof customers.$inferSelect;
export type NewCustomerType = typeof customers.$inferInsert;
