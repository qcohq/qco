import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    varchar,
    json,
    boolean,
    integer,
    timestamp,
    index
} from "drizzle-orm/pg-core";
import { products } from "../products";

export const productTypes = pgTable("product_types", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    slugIdx: index("idx_product_types_slug").on(t.slug),
    createdAtIdx: index("idx_product_types_created_at").on(t.createdAt),
}));

export const productTypeAttributes = pgTable("product_type_attributes", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    productTypeId: text("product_type_id")
        .notNull()
        .references(() => productTypes.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    type: varchar("type", { length: 32 }).notNull(),
    options: json("options").$type<string[]>().default([]),
    isFilterable: boolean("is_filterable").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isRequired: boolean("is_required").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    productTypeIdx: index("idx_product_type_attributes_product_type_id").on(t.productTypeId),
    slugIdx: index("idx_product_type_attributes_slug").on(t.slug),
    sortOrderIdx: index("idx_product_type_attributes_sort_order").on(t.sortOrder),
    isActiveIdx: index("idx_product_type_attributes_is_active").on(t.isActive),
}));

export const productAttributeValues = pgTable("product_attribute_values", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    productId: text("product_id").notNull(),
    attributeId: text("attribute_id").notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    productIdx: index("idx_product_attribute_values_product_id").on(t.productId),
    attributeIdx: index("idx_product_attribute_values_attribute_id").on(t.attributeId),
}));

// Определение отношений
export const productTypesRelations = relations(productTypes, ({ many }) => ({
    attributes: many(productTypeAttributes),
}));

export const productTypeAttributesRelations = relations(productTypeAttributes, ({ one, many }) => ({
    productType: one(productTypes, {
        fields: [productTypeAttributes.productTypeId],
        references: [productTypes.id],
    }),
    values: many(productAttributeValues),
}));

export const productAttributeValuesRelations = relations(productAttributeValues, ({ one }) => ({
    attribute: one(productTypeAttributes, {
        fields: [productAttributeValues.attributeId],
        references: [productTypeAttributes.id],
    }),
    product: one(products, {
        fields: [productAttributeValues.productId],
        references: [products.id],
    }),
}));

// Экспорт типов
export type ProductType = typeof productTypes.$inferSelect;
export type NewProductType = typeof productTypes.$inferInsert;

export type ProductTypeAttribute = typeof productTypeAttributes.$inferSelect;
export type NewProductTypeAttribute = typeof productTypeAttributes.$inferInsert;

export type ProductAttributeValue = typeof productAttributeValues.$inferSelect;
export type NewProductAttributeValue = typeof productAttributeValues.$inferInsert; 