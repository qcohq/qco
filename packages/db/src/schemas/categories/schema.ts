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

import { files } from "../file";
import { productCategories } from "../products";
import { categoryProductTypes } from "./product-types";

// Таблица категорий
export const categories = pgTable("categories", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    xmlId: varchar("xml_id", { length: 255 }).unique(),
    description: text("description"),
    parentId: text("parent_id").references((): any => categories.id),
    imageId: text("image_id").references(() => files.id),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").default(0),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    metaKeywords: varchar("meta_keywords", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    productsCount: integer("products_count").notNull().default(0),
}, (table) => ({
    parentIdx: index("category_parent_idx").on(table.parentId),
    slugIdx: index("category_slug_idx").on(table.slug),
    activeIdx: index("category_active_idx").on(table.isActive),
}));

// Определение отношений для категорий
export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
    }),
    children: many(categories),
    image: one(files, {
        fields: [categories.imageId],
        references: [files.id],
    }),
    productCategories: many(productCategories),
    // Добавляем новое отношение
    categoryProductTypes: many(categoryProductTypes),
}));
