# Инструкции для бота: Проверка соответствия схем

## Задача

Бот должен автоматически проверять соответствие схем между всеми слоями приложения и сообщать о несоответствиях.

## Что проверять

### 1. Схемы базы данных (`packages/db/src/schemas/`)

Проверять Drizzle схемы на соответствие с:
- Типами полей в валидаторах
- Типами в API роутах
- Типами на фронтенде

**Примеры проверок:**
```typescript
// packages/db/src/schemas/products.ts
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: text("category_id").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2. Схемы валидации (`packages/validators/src/`)

Проверять Zod схемы на соответствие с:
- Типами полей в БД
- Типами в API роутах
- Типами на фронтенде

**Примеры проверок:**
```typescript
// packages/validators/src/products.ts
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  categoryId: z.string(),
  status: z.enum(["active", "inactive", "draft"]),
  createdAt: z.string().datetime(),
});
```

### 3. API роуты (`packages/api/src/` и `packages/web-api/src/`)

Проверять tRPC роуты на соответствие с:
- Входными параметрами валидаторов
- Возвращаемыми типами
- Типами в БД

**Примеры проверок:**
```typescript
// packages/web-api/src/router/products.ts
export const productsRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Проверять, что возвращаемый тип соответствует productSchema
    }),
    
  create: publicProcedure
    .input(productCreateSchema)
    .mutation(async ({ input }) => {
      // Проверять соответствие input с БД схемой
    }),
});
```

### 4. Фронтенд типы (`apps/app/src/` и `apps/web/src/`)

Проверять TypeScript типы на соответствие с:
- Типами API роутов
- Типами валидаторов
- Типами в БД

**Примеры проверок:**
```typescript
// apps/app/src/features/product-management/types.ts
interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}
```

## Правила проверки

### 1. Соответствие типов

**Строки:**
- БД: `varchar`, `text` → Валидатор: `z.string()` → API: `string` → Фронтенд: `string`

**Числа:**
- БД: `int`, `bigint`, `decimal` → Валидатор: `z.number()` → API: `number` → Фронтенд: `number`

**Булевы:**
- БД: `boolean` → Валидатор: `z.boolean()` → API: `boolean` → Фронтенд: `boolean`

**Даты:**
- БД: `timestamp`, `date` → Валидатор: `z.string().datetime()` → API: `string` → Фронтенд: `string`

### 2. Обязательные поля

Проверять, что все обязательные поля присутствуют во всех слоях:
- БД: `.notNull()` → Валидатор: без `.optional()` → API: обязательный параметр → Фронтенд: без `?`

### 3. Enum значения

Проверять соответствие enum значений:
```typescript
// БД
status: text("status").notNull().default("active")

// Валидатор  
status: z.enum(["active", "inactive", "draft"])

// API
status: "active" | "inactive" | "draft"

// Фронтенд
status: "active" | "inactive" | "draft"
```

### 4. Связи между таблицами

Проверять внешние ключи:
```typescript
// БД
categoryId: text("category_id").notNull().references(() => categories.id)

// Валидатор
categoryId: z.string()

// API
categoryId: string

// Фронтенд
categoryId: string
```

## Что сообщать при ошибках

### 1. Несоответствие типов

```
❌ Type mismatch in Product.name:
   DB: varchar(255)
   Validator: z.string()
   API: string  
   Frontend: string
   ✅ All layers match
```

### 2. Отсутствующие поля

```
❌ Missing field in Product:
   DB: ✅ has 'price'
   Validator: ❌ missing 'price'
   API: ❌ missing 'price'
   Frontend: ❌ missing 'price'
```

### 3. Несоответствие enum

```
❌ Enum mismatch in Product.status:
   DB: ["active", "inactive"]
   Validator: ["active", "inactive", "draft"]
   API: ["active", "inactive", "draft"]
   Frontend: ["active", "inactive", "draft"]
   
   Missing in DB: "draft"
```

### 4. Несоответствие обязательности

```
❌ Required field mismatch in Product.categoryId:
   DB: ✅ required (.notNull())
   Validator: ❌ optional (.optional())
   API: ❌ optional
   Frontend: ❌ optional (?)
```

## Основные сущности для проверки

1. **Products** (`products`)
2. **Orders** (`orders`)
3. **Customers** (`customers`)
4. **Categories** (`categories`)
5. **Brands** (`brands`)
6. **Product Types** (`product_types`)
7. **Product Variants** (`product_variants`)
8. **Order Items** (`order_items`)
9. **Customer Addresses** (`customer_addresses`)
10. **Blog Posts** (`blog_posts`)

## Файлы для анализа

### База данных
- `packages/db/src/schemas/products.ts`
- `packages/db/src/schemas/orders.ts`
- `packages/db/src/schemas/customers.ts`
- `packages/db/src/schemas/categories.ts`
- `packages/db/src/schemas/brands.ts`

### Валидаторы
- `packages/validators/src/products.ts`
- `packages/validators/src/orders.ts`
- `packages/validators/src/customers.ts`
- `packages/validators/src/categories.ts`
- `packages/validators/src/brands.ts`

### API роуты
- `packages/web-api/src/router/products.ts`
- `packages/web-api/src/router/orders.ts`
- `packages/web-api/src/router/customers.ts`
- `packages/web-api/src/router/categories.ts`
- `packages/web-api/src/router/brands.ts`

### Фронтенд типы
- `apps/app/src/features/product-management/types.ts`
- `apps/app/src/features/order-management/types.ts`
- `apps/app/src/features/customer-management/types.ts`
- `apps/app/src/features/category-management/types.ts`
- `apps/app/src/features/brand-management/types.ts`

## Формат отчета

При обнаружении несоответствий выводить:

```
🔍 Schema Validation Report
==========================

Entity: Product
Status: ❌ Issues found

Issues:
1. Type mismatch in 'price' field
2. Missing 'status' field in validator
3. Enum mismatch in 'category' field

Recommendations:
1. Update validator to match DB schema
2. Add missing fields to API types
3. Sync enum values across all layers

Entity: Order  
Status: ✅ All schemas match

Entity: Customer
Status: ⚠️ Warnings found

Warnings:
1. Optional field 'phone' in DB but required in validator
```

## Когда проверять

1. **При анализе кода** - автоматически при просмотре файлов схем
2. **При запросе пользователя** - когда пользователь просит проверить схемы
3. **При создании новых сущностей** - автоматически при добавлении новых схем
4. **При изменении существующих схем** - автоматически при модификации

## Рекомендации по исправлению

При обнаружении несоответствий предлагать:

1. **Конкретные изменения** в файлах
2. **Примеры кода** для исправления
3. **Порядок исправления** (сначала БД, потом валидаторы, затем API, наконец фронтенд)
4. **Проверку после исправления**

## Примеры правильных схем

### Product (все слои соответствуют)

```typescript
// БД
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Валидатор
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  categoryId: z.string(),
  status: z.enum(["active", "inactive", "draft"]),
  createdAt: z.string().datetime(),
});

// API
interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}

// Фронтенд
interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}
```

## Критерии успешной проверки

✅ **Все типы соответствуют** между слоями
✅ **Все обязательные поля** присутствуют везде
✅ **Enum значения** синхронизированы
✅ **Связи между таблицами** корректны
✅ **Названия полей** совпадают (с учетом camelCase/snake_case)
✅ **Валидационные правила** соответствуют ограничениям БД 