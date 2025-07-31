import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { brands } from "../brands";
import { files } from "../file";
import { categories } from "../categories";
import { favorites } from "../favorites";
import { productVariants } from "./variants";
import { productSpecifications } from "./specifications";
import { productTypes, productAttributeValues } from "../product-types";

// Таблица продуктов бренда
export const products = pgTable("products", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  brandId: text("brand_id").references(() => brands.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPopular: boolean("is_popular").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  stock: integer("stock"),
  sku: varchar("sku", { length: 100 }),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  discountPercent: integer("discount_percent"),
  hasVariants: boolean("has_variants").notNull().default(false),
  productTypeId: text("product_type_id")
    .references(() => productTypes.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoUrl: varchar("seo_url", { length: 255 }),
  seoDescription: varchar("seo_description", { length: 500 }),
  seoKeywords: varchar("seo_keywords", { length: 255 }),

  xmlId: varchar("xml_id", { length: 255 }).unique(),
});

// Таблица файлов продуктов
export const productFiles = pgTable("product_files", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fileId: text("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // gallery, thumbnail, main, etc.
  order: integer("order").default(0),

  alt: varchar("alt", { length: 255 }), // Альтернативный текст для изображения
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Таблица для связи продуктов и категорий
export const productCategories = pgTable(
  "product_categories",
  {
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
    productIdx: index("product_idx").on(t.productId),
    categoryIdx: index("category_idx").on(t.categoryId),
  }),
);

// Определение отношений между товарами и брендами
export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  files: many(productFiles),
  categories: many(productCategories),
  favorites: many(favorites),
  variants: many(productVariants),
  specifications: many(productSpecifications),
  attributeValues: many(productAttributeValues),
}));

export const productFilesRelations = relations(productFiles, ({ one }) => ({
  product: one(products, {
    fields: [productFiles.productId],
    references: [products.id],
  }),
  file: one(files, {
    fields: [productFiles.fileId],
    references: [files.id],
  }),
}));

// Определение отношений между ProductCategory и Category
export const productCategoriesRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
