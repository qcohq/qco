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
} from "drizzle-orm/pg-core";

// Таблица настроек доставки
export const deliverySettings = pgTable("delivery_settings", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    // Тип доставки
    deliveryType: varchar("delivery_type", { length: 50 }).notNull(), // "pickup", "courier", "post", "cdek", "boxberry"

    // Финансовые настройки
    minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }).default("0"),
    maxOrderAmount: decimal("max_order_amount", { precision: 10, scale: 2 }),
    deliveryCost: decimal("delivery_cost", { precision: 10, scale: 2 }).default("0"),
    freeDeliveryThreshold: decimal("free_delivery_threshold", { precision: 10, scale: 2 }),

    // Временные и физические ограничения
    estimatedDays: integer("estimated_days"),
    weightLimit: decimal("weight_limit", { precision: 8, scale: 2 }),
    sizeLimit: varchar("size_limit", { length: 100 }), // "ДxШxВ в см"

    // Регионы и статус
    regions: text("regions").array(), // Список регионов РФ
    isActive: boolean("is_active").notNull().default(true),
    isDefault: boolean("is_default").notNull().default(false),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    typeIdx: index("delivery_settings_type_idx").on(table.deliveryType),
    activeIdx: index("delivery_settings_active_idx").on(table.isActive),
    defaultIdx: index("delivery_settings_default_idx").on(table.isDefault),
}));

// Таблица пунктов выдачи
export const pickupPoints = pgTable("pickup_points", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    region: varchar("region", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    phone: varchar("phone", { length: 20 }),
    workingHours: varchar("working_hours", { length: 255 }),
    coordinates: varchar("coordinates", { length: 50 }), // "lat,lng"

    // Статус и связь
    isActive: boolean("is_active").notNull().default(true),
    deliverySettingsId: text("delivery_settings_id").references(() => deliverySettings.id, {
        onDelete: "cascade",
    }),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    cityIdx: index("pickup_points_city_idx").on(table.city),
    regionIdx: index("pickup_points_region_idx").on(table.region),
    activeIdx: index("pickup_points_active_idx").on(table.isActive),
}));

// Таблица зон доставки
export const deliveryZones = pgTable("delivery_zones", {
    id: text("id")
        .$defaultFn(() => createId())
        .primaryKey(),

    // Основная информация
    name: varchar("name", { length: 255 }).notNull(),
    region: varchar("region", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }),

    // Стоимость и время
    deliveryCost: decimal("delivery_cost", { precision: 10, scale: 2 }).notNull(),
    estimatedDays: integer("estimated_days").notNull(),

    // Статус и связь
    isActive: boolean("is_active").notNull().default(true),
    deliverySettingsId: text("delivery_settings_id").references(() => deliverySettings.id, {
        onDelete: "cascade",
    }),

    // Временные метки
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
    regionIdx: index("delivery_zones_region_idx").on(table.region),
    cityIdx: index("delivery_zones_city_idx").on(table.city),
    activeIdx: index("delivery_zones_active_idx").on(table.isActive),
}));

// Определение отношений
export const deliverySettingsRelations = relations(deliverySettings, ({ many }) => ({
    pickupPoints: many(pickupPoints),
    deliveryZones: many(deliveryZones),
}));

export const pickupPointsRelations = relations(pickupPoints, ({ one }) => ({
    deliverySettings: one(deliverySettings, {
        fields: [pickupPoints.deliverySettingsId],
        references: [deliverySettings.id],
    }),
}));

export const deliveryZonesRelations = relations(deliveryZones, ({ one }) => ({
    deliverySettings: one(deliverySettings, {
        fields: [deliveryZones.deliverySettingsId],
        references: [deliverySettings.id],
    }),
}));

// Типы для TypeScript
export type DeliverySettings = typeof deliverySettings.$inferSelect;
export type NewDeliverySettings = typeof deliverySettings.$inferInsert;

export type PickupPoint = typeof pickupPoints.$inferSelect;
export type NewPickupPoint = typeof pickupPoints.$inferInsert;

export type DeliveryZone = typeof deliveryZones.$inferSelect;
export type NewDeliveryZone = typeof deliveryZones.$inferInsert; 
