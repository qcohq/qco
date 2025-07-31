import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { admins } from "../admin";
import { categories } from "../categories";
import { files } from "../file";

// Таблица баннеров
export const banners = pgTable("banners", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  // Основная информация
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),

  // Ссылки и действия
  link: varchar("link", { length: 500 }),
  buttonText: varchar("button_text", { length: 100 }),
  buttonLink: varchar("button_link", { length: 500 }),

  // Настройки отображения
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").default(0),

  // Позиционирование
  position: varchar("position", { length: 50 }).notNull(), // header, hero, sidebar, footer
  page: varchar("page", { length: 100 }), // home, catalog, product, etc.

  // Связи
  categoryId: text("category_id").references(() => categories.id),

  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => admins.id),
  updatedBy: text("updated_by").references(() => admins.id),
}, (table) => ({
  positionIdx: index("banners_position_idx").on(table.position),
  pageIdx: index("banners_page_idx").on(table.page),
  activeIdx: index("banners_active_idx").on(table.isActive),
  featuredIdx: index("banners_featured_idx").on(table.isFeatured),
}));

// Таблица файлов баннеров
export const bannerFiles = pgTable("banner_files", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  bannerId: text("banner_id")
    .notNull()
    .references(() => banners.id, { onDelete: "cascade" }),
  fileId: text("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),

  type: varchar("type", { length: 50 }).notNull(), // main, mobile, tablet, etc.
  order: integer("order").default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  bannerIdx: index("banner_files_banner_idx").on(table.bannerId),
  fileIdx: index("banner_files_file_idx").on(table.fileId),
}));

// Определение отношений
export const bannersRelations = relations(banners, ({ one, many }) => ({
  category: one(categories, {
    fields: [banners.categoryId],
    references: [categories.id],
  }),
  createdByAdmin: one(admins, {
    fields: [banners.createdBy],
    references: [admins.id],
  }),
  updatedByAdmin: one(admins, {
    fields: [banners.updatedBy],
    references: [admins.id],
  }),
  files: many(bannerFiles),
}));

export const bannerFilesRelations = relations(bannerFiles, ({ one }) => ({
  banner: one(banners, {
    fields: [bannerFiles.bannerId],
    references: [banners.id],
  }),
  file: one(files, {
    fields: [bannerFiles.fileId],
    references: [files.id],
  }),
}));

// Типы для TypeScript
export type Banner = typeof banners.$inferSelect;
export type NewBanner = typeof banners.$inferInsert;

export type BannerFile = typeof bannerFiles.$inferSelect;
export type NewBannerFile = typeof bannerFiles.$inferInsert;
