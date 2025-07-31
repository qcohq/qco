# Drizzle ORM - Руководство по созданию схем

## Содержание

1. [Основные принципы](#основные-принципы)
2. [Структура файлов](#структура-файлов)
3. [Создание базовой схемы](#создание-базовой-схемы)
4. [Типы данных и ограничения](#типы-данных-и-ограничения)
5. [Связи между таблицами](#связи-между-таблицами)
6. [Индексы и производительность](#индексы-и-производительность)
7. [Валидация и константы](#валидация-и-константы)
8. [Миграции](#миграции)
9. [Лучшие практики](#лучшие-практики)
10. [Примеры схем](#примеры-схем)

---

## Основные принципы

### 1. Именование
- **Таблицы**: camelCase (например, `productVariants`)
- **Колонки**: camelCase в коде, snake_case в БД (например, `productId` → `product_id`)
- **Relations**: camelCase (например, `productsRelations`)
- **Типы**: PascalCase (например, `Product`, `NewProduct`)
- **Индексы**: описательные имена (например, `idx_product_brand_id`)
- **Константы**: UPPER_SNAKE_CASE (например, `ORDER_STATUS_PENDING`)

### 2. Организация кода
- Каждая сущность в отдельной папке
- Схема в `schema.ts`
- Константы в `constants.ts`
- Отношения в `relations.ts`
- Экспорт через `index.ts`

### 3. Типобезопасность
- Всегда используйте TypeScript
- Экспортируйте типы для Select и Insert
- Используйте строгую типизацию для JSON полей

---

## Структура файлов

```
packages/db/src/schemas/
├── products/
│   ├── index.ts
│   ├── schema.ts
│   ├── constants.ts
│   ├── relations.ts
│   ├── variants/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── relations.ts
│   └── specifications/
│       ├── index.ts
│       ├── schema.ts
│       └── relations.ts
├── orders/
│   ├── index.ts
│   ├── schema.ts
│   ├── constants.ts
│   └── relations.ts
└── index.ts
```

---

## Создание базовой схемы

### 1. Основные импорты

```typescript
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
  json,
} from "drizzle-orm/pg-core";
```

### 2. Базовая таблица

```typescript
export const products = pgTable("products", {
  // Первичный ключ
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  
  // Обязательные поля
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  // Опциональные поля
  description: text("description"),
  
  // Булевы поля с дефолтными значениями
  isActive: boolean("is_active").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  
  // Числовые поля
  stock: integer("stock"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  
  // Внешние ключи
  brandId: text("brand_id").references(() => brands.id, {
    onDelete: "set null",
  }),
  
  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### 3. Экспорт типов

```typescript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

---

## Типы данных и ограничения

### 1. Строковые типы

```typescript
// Короткие строки (до 255 символов)
name: varchar("name", { length: 255 }).notNull(),

// Длинные строки
description: text("description"),

// Уникальные поля
slug: varchar("slug", { length: 255 }).notNull().unique(),
email: varchar("email", { length: 255 }).unique().notNull(),
```

### 2. Числовые типы

```typescript
// Целые числа
quantity: integer("quantity").notNull().default(1),
stock: integer("stock"),

// Десятичные числа (для цен)
price: decimal("price", { precision: 10, scale: 2 }).notNull(),
// precision: общее количество цифр
// scale: количество цифр после запятой
```

### 3. Булевы типы

```typescript
// Всегда указывайте дефолтное значение
isActive: boolean("is_active").notNull().default(false),
isPublished: boolean("is_published").notNull().default(true),
```

### 4. JSON поля

```typescript
// Строгая типизация для JSON
metadata: json("metadata").$type<{
  color?: string;
  size?: string;
  weight?: number;
}>(),

// Простые JSON объекты
attributes: json("attributes").$type<Record<string, string>>(),
```

### 5. Временные метки

```typescript
// Автоматические временные метки
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at").notNull().defaultNow(),

// Опциональные временные метки
publishedAt: timestamp("published_at"),
deletedAt: timestamp("deleted_at"),
```

---

## Связи между таблицами

### 1. Внешние ключи

```typescript
// Простая связь
brandId: text("brand_id").references(() => brands.id, {
  onDelete: "set null", // или "cascade", "restrict"
}),

// Обязательная связь
customerId: text("customer_id").notNull().references(() => customers.id, {
  onDelete: "restrict", // Запрещает удаление клиента с заказами
}),
```

### 2. Связующие таблицы (Many-to-Many)

```typescript
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
    productIdx: index("idx_product_category_product_id").on(t.productId),
    categoryIdx: index("idx_product_category_category_id").on(t.categoryId),
  }),
);
```

### 3. Определение отношений

```typescript
export const productsRelations = relations(products, ({ one, many }) => ({
  // One-to-One или Many-to-One
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  
  // One-to-Many
  variants: many(productVariants),
  files: many(productFiles),
  
  // Many-to-Many через связующую таблицу
  categories: many(productCategories),
}));

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
```

---

## Индексы и производительность

### 1. Автоматические индексы

```typescript
// Первичный ключ автоматически создает индекс
id: text("id").primaryKey(),

// Уникальные поля автоматически создают индексы
slug: varchar("slug", { length: 255 }).notNull().unique(),
email: varchar("email", { length: 255 }).unique().notNull(),
```

### 2. Ручные индексы

```typescript
export const products = pgTable(
  "products",
  {
    id: text("id").$defaultFn(() => createId()).primaryKey(),
    brandId: text("brand_id").references(() => brands.id),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    // Простой индекс
    brandIdx: index("idx_products_brand_id").on(t.brandId),
    
    // Составной индекс
    activeBrandIdx: index("idx_products_active_brand").on(
      t.isActive,
      t.brandId
    ),
    
    // Индекс для сортировки
    createdAtIdx: index("idx_products_created_at").on(t.createdAt),
  }),
);
```

### 3. Частичные индексы

```typescript
// Индекс только для активных продуктов
activeIdx: index("idx_products_active").on(t.id).where(eq(t.isActive, true)),
```

---

## Валидация и константы

### 1. Enum константы

```typescript
// constants.ts
export const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  CASH: "cash",
} as const;

// Создание enum типов
export const orderStatusEnum = pgEnum("order_status", [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.CASH,
]);
```

### 2. Использование в схеме

```typescript
export const orders = pgTable("orders", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  
  // Использование enum
  status: orderStatusEnum("status").notNull().default(OrderStatus.PENDING),
  paymentMethod: paymentMethodEnum("payment_method").default(PaymentMethod.CREDIT_CARD),
  
  // Остальные поля...
});
```

---

## Миграции

### 1. Генерация миграций

```bash
# Генерация миграции
bun run db:generate

# Применение миграций
bun run db:migrate

# Откат миграции
bun run db:migrate:down
```

### 2. Структура миграции

```sql
-- Миграция создается автоматически
CREATE TABLE IF NOT EXISTS "products" (
  "id" text PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "description" text,
  "is_active" boolean NOT NULL DEFAULT false,
  "brand_id" text REFERENCES "brands"("id") ON DELETE SET NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_products_brand_id" ON "products"("brand_id");
```

---

## Лучшие практики

### 1. Именование и организация

✅ **Правильно:**
```typescript
// Четкие имена таблиц в camelCase
export const products = pgTable("products", { ... });
export const productVariants = pgTable("product_variants", { ... });

// Логичная группировка полей
export const orders = pgTable("orders", {
  // Идентификаторы
  id: text("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  
  // Основная информация
  status: orderStatusEnum("status").notNull().default(OrderStatus.PENDING),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Связи
  customerId: text("customer_id").notNull().references(() => customers.id),
  
  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

❌ **Неправильно:**
```typescript
// Нечеткие имена
export const prod = pgTable("prod", { ... });

// Смешанная группировка полей
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull(),
  status: orderStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
});
```

### 2. Типизация

✅ **Правильно:**
```typescript
// Строгая типизация JSON
metadata: json("metadata").$type<{
  color?: string;
  size?: string;
  weight?: number;
}>(),

// Экспорт типов в PascalCase
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
```

❌ **Неправильно:**
```typescript
// Слабая типизация
metadata: json("metadata"),

// Отсутствие экспорта типов
```

### 3. Связи и производительность

✅ **Правильно:**
```typescript
// Правильные onDelete действия
customerId: text("customer_id").notNull().references(() => customers.id, {
  onDelete: "restrict", // Защищает от удаления клиента с заказами
}),

// Индексы для часто используемых полей
brandIdx: index("idx_products_brand_id").on(t.brandId),
```

❌ **Неправильно:**
```typescript
// Неправильные onDelete действия
customerId: text("customer_id").notNull().references(() => customers.id, {
  onDelete: "cascade", // Может удалить важные данные
}),

// Отсутствие индексов для часто запрашиваемых полей
```

### 4. Валидация

✅ **Правильно:**
```typescript
// Использование enum для ограниченных значений
status: orderStatusEnum("status").notNull().default(OrderStatus.PENDING),

// Правильные ограничения длины
name: varchar("name", { length: 255 }).notNull(),
description: text("description"), // Для длинного текста
```

❌ **Неправильно:**
```typescript
// Строковые поля без ограничений
status: text("status").notNull(),

// Неправильные ограничения длины
description: varchar("description", { length: 255 }), // Может быть слишком коротким
```

---

## Примеры схем

### 1. Простая схема (Бренды)

```typescript
// packages/db/src/schemas/brands/schema.ts
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 255 }),
  website: varchar("website", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
```

### 2. Сложная схема (Заказы)

```typescript
// packages/db/src/schemas/orders/schema.ts
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  decimal, 
  json, 
  integer,
  index 
} from "drizzle-orm/pg-core";
import { OrderStatus, PaymentMethod, orderStatusEnum, paymentMethodEnum } from "./constants";

export const orders = pgTable("orders", {
  id: text("id").$defaultFn(() => createId()).primaryKey(),
  
  // Основная информация
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  status: orderStatusEnum("status").notNull().default(OrderStatus.PENDING),
  
  // Финансовая информация
  subtotalAmount: decimal("subtotal_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Связи
  customerId: text("customer_id").notNull().references(() => customers.id, {
    onDelete: "restrict",
  }),
  
  // Временные метки
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => ({
  customerIdx: index("idx_orders_customer_id").on(t.customerId),
  statusIdx: index("idx_orders_status").on(t.status),
  createdAtIdx: index("idx_orders_created_at").on(t.createdAt),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
```

### 3. Связующая таблица (Продукты-Категории)

```typescript
// packages/db/src/schemas/products/product-categories.ts
import { relations } from "drizzle-orm";
import { pgTable, text, primaryKey, index } from "drizzle-orm/pg-core";
import { products } from "./schema";
import { categories } from "../categories";

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
    productIdx: index("idx_product_category_product_id").on(t.productId),
    categoryIdx: index("idx_product_category_category_id").on(t.categoryId),
  }),
);

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
```

---

## Заключение

Следуя этим принципам и практикам, вы создадите надежные, производительные и легко поддерживаемые схемы базы данных для вашего e-commerce проекта. Помните:

1. **Всегда используйте TypeScript** для типобезопасности
2. **Следуйте конвенциям именования** для консистентности
3. **Добавляйте индексы** для часто запрашиваемых полей
4. **Правильно настраивайте связи** с учетом бизнес-логики
5. **Используйте enum** для ограниченных значений
6. **Экспортируйте типы** для использования в приложении
7. **Группируйте поля логично** для читаемости кода
8. **Добавляйте комментарии** для сложной логики

Эти принципы помогут создать масштабируемую и надежную архитектуру базы данных для вашего проекта.
