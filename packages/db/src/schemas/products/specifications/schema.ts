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

import { products } from "../schema";

// Таблица спецификаций продуктов
export const productSpecifications = pgTable("product_specifications", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Связь с продуктом
    productId: text("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(),
    value: text("value").notNull(),
    unit: varchar("unit", { length: 50 }),

    // Группировка и сортировка
    group: varchar("group", { length: 100 }),
    sortOrder: integer("sort_order").default(0),

    // Статус
    isActive: boolean("is_active").notNull().default(true),
    isFilterable: boolean("is_filterable").notNull().default(false),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    productIdx: index("product_specifications_product_idx").on(table.productId),
    groupIdx: index("product_specifications_group_idx").on(table.group),
    filterableIdx: index("product_specifications_filterable_idx").on(table.isFilterable),
}));

// Определение отношений
export const productSpecificationsRelations = relations(productSpecifications, ({ one }) => ({
    product: one(products, {
        fields: [productSpecifications.productId],
        references: [products.id],
    }),
}));

// Типы для TypeScript
export type ProductSpecification = typeof productSpecifications.$inferSelect;
export type NewProductSpecification = typeof productSpecifications.$inferInsert; 