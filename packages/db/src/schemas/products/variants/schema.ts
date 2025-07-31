import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
    boolean,
    decimal,
    index,
    integer,
    pgTable,
    text,
    timestamp,
    varchar,
    json,
} from "drizzle-orm/pg-core";

import { products } from "../schema";
import { files } from "../../file";

// Таблица вариантов продуктов
export const productVariants = pgTable("product_variants", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Связь с продуктом
    productId: text("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }).unique(),
    barcode: varchar("barcode", { length: 100 }),

    // Цены и наличие
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
    costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
    stock: integer("stock").default(0),
    minStock: integer("min_stock").default(0),

    // Вес и размеры
    weight: decimal("weight", { precision: 8, scale: 3 }),
    width: decimal("width", { precision: 8, scale: 2 }),
    height: decimal("height", { precision: 8, scale: 2 }),
    depth: decimal("depth", { precision: 8, scale: 2 }),

    // Статус
    isActive: boolean("is_active").notNull().default(true),
    isDefault: boolean("is_default").notNull().default(false),
    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    productIdx: index("product_variants_product_idx").on(table.productId),
    skuIdx: index("product_variants_sku_idx").on(table.sku),
    activeIdx: index("product_variants_active_idx").on(table.isActive),
}));

// Таблица опций вариантов (размер, цвет, вкус и т.д.)
export const productVariantOptions = pgTable("product_variant_options", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Связь с продуктом
    productId: text("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(), // Размер, Цвет, Вкус
    slug: varchar("slug", { length: 255 }).notNull(), // size, color, flavor
    type: varchar("type", { length: 50 }).notNull().default("select"), // select, color, text

    // Метаданные
    metadata: json("metadata").$type<Record<string, any>>(),

    // Порядок отображения
    sortOrder: integer("sort_order").default(0),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    productIdx: index("product_variant_options_product_idx").on(table.productId),
    slugIdx: index("product_variant_options_slug_idx").on(table.slug),
}));

// Таблица значений опций (S, M, L для размера; красный, синий для цвета)
export const productVariantOptionValues = pgTable("product_variant_option_values", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Связь с опцией
    optionId: text("option_id")
        .notNull()
        .references(() => productVariantOptions.id, { onDelete: "cascade" }),

    // Значение
    value: varchar("value", { length: 255 }).notNull(), // S, M, L или Красный, Синий
    displayName: varchar("display_name", { length: 255 }).notNull(), // Отображаемое имя

    // Метаданные (для цветов - hex код, для размеров - размерная таблица)
    metadata: json("metadata").$type<Record<string, any>>(),

    // Порядок отображения
    sortOrder: integer("sort_order").default(0),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    optionIdx: index("product_variant_option_values_option_idx").on(table.optionId),
    valueIdx: index("product_variant_option_values_value_idx").on(table.value),
}));

// Таблица связи вариантов с опциями (какие опции у какого варианта)
export const productVariantOptionCombinations = pgTable("product_variant_option_combinations", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Связь с вариантом
    variantId: text("variant_id")
        .notNull()
        .references(() => productVariants.id, { onDelete: "cascade" }),

    // Связь с опцией
    optionId: text("option_id")
        .notNull()
        .references(() => productVariantOptions.id, { onDelete: "cascade" }),

    // Связь со значением опции
    optionValueId: text("option_value_id")
        .notNull()
        .references(() => productVariantOptionValues.id, { onDelete: "cascade" }),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    variantIdx: index("product_variant_option_combinations_variant_idx").on(table.variantId),
    optionIdx: index("product_variant_option_combinations_option_idx").on(table.optionId),
    uniqueVariantOption: index("product_variant_option_combinations_unique_idx").on(table.variantId, table.optionId),
}));

// Таблица файлов вариантов
export const productVariantFiles = pgTable("product_variant_files", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    variantId: text("variant_id")
        .notNull()
        .references(() => productVariants.id, { onDelete: "cascade" }),
    fileId: text("file_id")
        .notNull()
        .references(() => files.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 50 }).notNull(), // main, gallery, thumbnail
    order: integer("order").default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    variantIdx: index("product_variant_files_variant_idx").on(table.variantId),
    fileIdx: index("product_variant_files_file_idx").on(table.fileId),
}));

// Определение отношений
export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    files: many(productVariantFiles),
    optionCombinations: many(productVariantOptionCombinations),
}));

export const productVariantOptionsRelations = relations(productVariantOptions, ({ one, many }) => ({
    product: one(products, {
        fields: [productVariantOptions.productId],
        references: [products.id],
    }),
    values: many(productVariantOptionValues),
    combinations: many(productVariantOptionCombinations),
}));

export const productVariantOptionValuesRelations = relations(productVariantOptionValues, ({ one, many }) => ({
    option: one(productVariantOptions, {
        fields: [productVariantOptionValues.optionId],
        references: [productVariantOptions.id],
    }),
    combinations: many(productVariantOptionCombinations),
}));

export const productVariantOptionCombinationsRelations = relations(productVariantOptionCombinations, ({ one }) => ({
    variant: one(productVariants, {
        fields: [productVariantOptionCombinations.variantId],
        references: [productVariants.id],
    }),
    option: one(productVariantOptions, {
        fields: [productVariantOptionCombinations.optionId],
        references: [productVariantOptions.id],
    }),
    optionValue: one(productVariantOptionValues, {
        fields: [productVariantOptionCombinations.optionValueId],
        references: [productVariantOptionValues.id],
    }),
}));

export const productVariantFilesRelations = relations(productVariantFiles, ({ one }) => ({
    variant: one(productVariants, {
        fields: [productVariantFiles.variantId],
        references: [productVariants.id],
    }),
    file: one(files, {
        fields: [productVariantFiles.fileId],
        references: [files.id],
    }),
}));

// Типы для TypeScript
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductVariantOption = typeof productVariantOptions.$inferSelect;
export type NewProductVariantOption = typeof productVariantOptions.$inferInsert;

export type ProductVariantOptionValue = typeof productVariantOptionValues.$inferSelect;
export type NewProductVariantOptionValue = typeof productVariantOptionValues.$inferInsert;

export type ProductVariantOptionCombination = typeof productVariantOptionCombinations.$inferSelect;
export type NewProductVariantOptionCombination = typeof productVariantOptionCombinations.$inferInsert;

export type ProductVariantFile = typeof productVariantFiles.$inferSelect;
export type NewProductVariantFile = typeof productVariantFiles.$inferInsert; 