import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum для статуса приглашения
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
  "cancelled",
]);

// Enum для роли администратора
export const adminRoleEnum = pgEnum("admin_role", [
  "super_admin",
  "admin",
  "moderator",
  "editor",
]);

export const accounts = pgTable("accounts", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
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
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(admins, { fields: [accounts.userId], references: [admins.id] }),
}));

export const sessions = pgTable("sessions", {
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
    .references(() => admins.id, { onDelete: "cascade" }),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(admins, { fields: [sessions.userId], references: [admins.id] }),
}));

export const verifications = pgTable("verifications", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: varchar("image", { length: 255 }),
  role: adminRoleEnum("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminInvitations = pgTable("admin_invitations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: adminRoleEnum("role").notNull().default("admin"),
  token: text("token").notNull().unique(),
  status: invitationStatusEnum("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  acceptedBy: text("accepted_by").references(() => admins.id),
  invitedBy: text("invited_by").notNull().references(() => admins.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminsRelations = relations(admins, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  sentInvitations: many(adminInvitations, { relationName: "invitedBy" }),
  acceptedInvitations: many(adminInvitations, { relationName: "acceptedBy" }),
}));

export const adminInvitationsRelations = relations(adminInvitations, ({ one }) => ({
  invitedByAdmin: one(admins, {
    fields: [adminInvitations.invitedBy],
    references: [admins.id],
    relationName: "invitedBy",
  }),
  acceptedByAdmin: one(admins, {
    fields: [adminInvitations.acceptedBy],
    references: [admins.id],
    relationName: "acceptedBy",
  }),
}));
