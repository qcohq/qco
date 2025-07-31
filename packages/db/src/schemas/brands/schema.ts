import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { files } from "../file/schema";
import { admins } from "../admin/schema";
import { categories } from "../categories/schema";

// Определение таблиц
export const brands = pgTable("brands", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  website: text("website"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  foundedYear: varchar("founded_year", { length: 10 }),
  countryOfOrigin: varchar("country_of_origin", { length: 255 }),
  brandColor: varchar("brand_color", { length: 7 }),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  metaKeywords: json("meta_keywords").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => admins.id),
  updatedBy: text("updated_by").references(() => admins.id),
});

// Таблица файлов брендов
export const brandFiles = pgTable("brand_files", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  fileId: text("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // logo, banner, gallery, video, etc.
  order: integer("order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Связующая таблица брендов и категорий (только категории первого уровня)
export const brandCategories = pgTable("brand_categories", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  brandId: text("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Определение отношений между таблицами
export const brandsRelations = relations(brands, ({ many }) => ({
  files: many(brandFiles),
  brandCategories: many(brandCategories),
}));

export const brandFilesRelations = relations(brandFiles, ({ one }) => ({
  brand: one(brands, {
    fields: [brandFiles.brandId],
    references: [brands.id],
  }),
  file: one(files, {
    fields: [brandFiles.fileId],
    references: [files.id],
  }),
}));

export const brandCategoriesRelations = relations(brandCategories, ({ one }) => ({
  brand: one(brands, {
    fields: [brandCategories.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [brandCategories.categoryId],
    references: [categories.id],
  }),
}));
