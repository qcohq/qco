import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { categories } from "./schema";
import { productTypes } from "../product-types";

// Таблица для связи категорий с типами продуктов
export const categoryProductTypes = pgTable("category_product_types", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),
    categoryId: text("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
    productTypeId: text("product_type_id")
        .notNull()
        .references(() => productTypes.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
    categoryIdx: index("idx_category_product_types_category_id").on(t.categoryId),
    productTypeIdx: index("idx_category_product_types_product_type_id").on(t.productTypeId),
    primaryIdx: index("idx_category_product_types_primary").on(t.isPrimary),
    uniqueCategoryProductType: index("idx_category_product_types_unique").on(t.categoryId, t.productTypeId),
}));

// Определение отношений
export const categoryProductTypesRelations = relations(categoryProductTypes, ({ one }) => ({
    category: one(categories, {
        fields: [categoryProductTypes.categoryId],
        references: [categories.id],
    }),
    productType: one(productTypes, {
        fields: [categoryProductTypes.productTypeId],
        references: [productTypes.id],
    }),
})); 