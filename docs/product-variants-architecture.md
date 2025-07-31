# Архитектура вариантов продукта

## Обзор

В нашей системе четко разделены два разных типа характеристик продукта:

1. **Атрибуты типа продукта** (Product Type Attributes) - общие характеристики типа продукта
2. **Опции вариантов** (Product Variant Options) - характеристики, которые создают варианты продукта

## Атрибуты типа продукта vs Опции вариантов

### Атрибуты типа продукта (Product Type Attributes)

**Назначение:** Описывают общие характеристики типа продукта, которые не влияют на создание вариантов.

**Примеры:**
- Материал (хлопок, шелк, полиэстер)
- Сезон (весна, лето, осень, зима)
- Пол (мужской, женский, унисекс)
- Бренд
- Страна производства
- Инструкции по уходу

**Таблицы:**
- `product_types` - типы продуктов
- `product_type_attributes` - атрибуты типа продукта
- `product_type_attribute_values` - значения атрибутов для конкретного продукта

### Опции вариантов (Product Variant Options)

**Назначение:** Определяют характеристики, которые создают различные варианты одного продукта.

**Примеры:**
- Размер (S, M, L, XL)
- Цвет (красный, синий, зеленый)
- Вкус (шоколад, ваниль, клубника)
- Объем (250мл, 500мл, 1л)
- Конфигурация (WiFi, WiFi+4G)

**Таблицы:**
- `product_variant_options` - опции вариантов (размер, цвет, вкус)
- `product_variant_option_values` - значения опций (S, M, L для размера)
- `product_variant_option_combinations` - связь вариантов с опциями
- `product_variants` - сами варианты продукта

## Структура базы данных

### Опции вариантов

```sql
-- Таблица опций вариантов
CREATE TABLE product_variant_options (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    name VARCHAR(255) NOT NULL,           -- "Размер", "Цвет"
    slug VARCHAR(255) NOT NULL,           -- "size", "color"
    type VARCHAR(50) NOT NULL,            -- "select", "color", "text"
    metadata JSONB,                       -- дополнительные метаданные
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица значений опций
CREATE TABLE product_variant_option_values (
    id TEXT PRIMARY KEY,
    option_id TEXT NOT NULL REFERENCES product_variant_options(id),
    value VARCHAR(255) NOT NULL,          -- "S", "M", "L"
    display_name VARCHAR(255) NOT NULL,   -- "Малый", "Средний", "Большой"
    metadata JSONB,                       -- hex для цветов, размерная таблица
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица комбинаций опций для вариантов
CREATE TABLE product_variant_option_combinations (
    id TEXT PRIMARY KEY,
    variant_id TEXT NOT NULL REFERENCES product_variants(id),
    option_id TEXT NOT NULL REFERENCES product_variant_options(id),
    option_value_id TEXT NOT NULL REFERENCES product_variant_option_values(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Атрибуты типа продукта

```sql
-- Таблица типов продуктов
CREATE TABLE product_types (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица атрибутов типа продукта
CREATE TABLE product_type_attributes (
    id TEXT PRIMARY KEY,
    product_type_id TEXT NOT NULL REFERENCES product_types(id),
    name VARCHAR(255) NOT NULL,           -- "Материал", "Сезон"
    slug VARCHAR(255) NOT NULL,           -- "material", "season"
    type VARCHAR(32) NOT NULL,            -- "text", "select", "boolean"
    options JSONB DEFAULT '[]',           -- для select/multiselect
    is_filterable BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица значений атрибутов для конкретного продукта
CREATE TABLE product_attribute_values (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id),
    attribute_id TEXT NOT NULL REFERENCES product_type_attributes(id),
    value TEXT NOT NULL,                  -- "Хлопок", "Лето"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Улучшения в API

### Функция getBySlug

В функции `packages/web-api/src/router/products/get-by-slug.ts` реализовано четкое разделение:

```typescript
// 1. Получаем опции вариантов (размер, цвет и т.д.)
const variantOptionsData = await ctx.db.query.productVariantOptions.findMany({
  where: eq(productVariantOptions.productId, product.id),
  with: {
    values: {
      orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.displayName)],
    },
  },
  orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
}) || [];

// 2. Получаем атрибуты типа продукта (материал, сезон и т.д.)
const productTypeAttributesData = await ctx.db.query.productAttributeValues.findMany({
  where: eq(productAttributeValues.productId, product.id),
  with: {
    attribute: {
      columns: {
        id: true,
        name: true,
        slug: true,
        type: true,
        options: true,
        sortOrder: true,
      },
    },
  },
}) || [];

// 3. Извлекаем цвета и размеры из опций вариантов
const colors: Array<{ name: string; value: string; hex?: string }> = [];
const sizes: Array<{ name: string; value: string; inStock?: boolean }> = [];

for (const option of variantOptionsData) {
  if (option.name.toLowerCase() === "цвет" || option.name.toLowerCase() === "color") {
    option.values.forEach((value) => {
      colors.push({ 
        name: value.displayName || value.value, 
        value: value.value,
        hex: value.metadata?.hex || undefined,
      });
    });
  } else if (option.name.toLowerCase() === "размер" || option.name.toLowerCase() === "size") {
    option.values.forEach((value) => {
      sizes.push({ 
        name: value.displayName || value.value, 
        value: value.value,
        inStock: true, // TODO: проверить наличие по вариантам
      });
    });
  }
}

// 4. Формируем атрибуты типа продукта (материал, сезон и т.д.)
const attributes: Record<string, string> = {};
for (const attr of productTypeAttributesData) {
  attributes[attr.attribute.name] = attr.value;
}
```

### Варианты с опциями

```typescript
// Получаем варианты продукта с их опциями (размер, цвет и т.д.)
const variants = await ctx.db.query.productVariants.findMany({
  where: eq(productVariants.productId, product.id),
  with: {
    optionCombinations: {
      with: {
        option: {
          columns: {
            id: true,
            name: true,
            slug: true,
            type: true,
            sortOrder: true,
          },
        },
        optionValue: {
          columns: {
            id: true,
            value: true,
            displayName: true,
            metadata: true,
            sortOrder: true,
          },
        },
      },
    },
  },
}) || [];

// Форматируем варианты продукта с их опциями
const formattedVariants = variants.map((variant) => {
  // Создаем опции варианта на основе комбинаций опций (размер, цвет и т.д.)
  const variantOptions = variant.optionCombinations?.map((combination) => ({
    option: combination.option.name,
    value: combination.optionValue.displayName || combination.optionValue.value,
    metadata: combination.optionValue.metadata,
  })) || [];

  return {
    id: variant.id,
    productId: product.id,
    name: variant.name || `Вариант ${variant.id}`,
    // ... другие поля варианта
    options: variantOptions, // Опции варианта (размер, цвет и т.д.)
  };
});
```

## API методы

### Для работы с опциями вариантов

```typescript
// Создание опции
POST /api/trpc/productVariants.createOption
{
  "name": "Размер",
  "values": ["S", "M", "L", "XL"],
  "productId": "prod_123",
  "type": "select"
}

// Получение опций продукта
GET /api/trpc/productVariants.getOptions?productId=prod_123

// Добавление значения к опции
POST /api/trpc/productVariants.addOptionValue
{
  "optionId": "opt_123",
  "value": "XXL",
  "displayName": "Очень большой"
}

// Обновление опции
PUT /api/trpc/productVariants.updateOption
{
  "id": "opt_123",
  "name": "Размер одежды",
  "type": "select"
}

// Удаление опции
DELETE /api/trpc/productVariants.deleteOption
{
  "optionId": "opt_123"
}
```

### Для работы с атрибутами типа продукта

```typescript
// Создание атрибута типа продукта
POST /api/trpc/productTypeAttributes.create
{
  "name": "Материал",
  "type": "select",
  "options": ["Хлопок", "Шелк", "Полиэстер"],
  "productTypeId": "type_123"
}

// Установка значения атрибута для продукта
POST /api/trpc/productTypeAttributes.setValue
{
  "productId": "prod_123",
  "attributeId": "attr_123",
  "value": "Хлопок"
}
```

## Примеры использования

### Создание продукта с вариантами

```typescript
// 1. Создаем продукт
const product = await createProduct({
  name: "Футболка",
  productTypeId: "clothing_type_123", // Тип: Одежда
});

// 2. Создаем опции вариантов
await createVariantOption({
  name: "Размер",
  values: ["S", "M", "L", "XL"],
  productId: product.id,
  type: "select"
});

await createVariantOption({
  name: "Цвет",
  values: ["Красный", "Синий", "Зеленый"],
  productId: product.id,
  type: "color"
});

// 3. Устанавливаем атрибуты типа продукта
await setProductTypeAttributeValue({
  productId: product.id,
  attributeId: "material_attr_123", // Атрибут: Материал
  value: "Хлопок"
});

await setProductTypeAttributeValue({
  productId: product.id,
  attributeId: "season_attr_123", // Атрибут: Сезон
  value: "Лето"
});

// 4. Генерируем варианты
await generateVariants({
  productId: product.id,
  optionIds: ["size_option_123", "color_option_123"]
});
```

### Результат API

```json
{
  "id": "prod_123",
  "name": "Футболка",
  "variants": [
    {
      "id": "var_1",
      "name": "Футболка S Красный",
      "price": 1000,
      "options": [
        { "option": "Размер", "value": "S" },
        { "option": "Цвет", "value": "Красный" }
      ]
    },
    {
      "id": "var_2", 
      "name": "Футболка M Красный",
      "price": 1000,
      "options": [
        { "option": "Размер", "value": "M" },
        { "option": "Цвет", "value": "Красный" }
      ]
    }
  ],
  "colors": [
    { "name": "Красный", "value": "Красный", "hex": "#FF0000" },
    { "name": "Синий", "value": "Синий", "hex": "#0000FF" }
  ],
  "sizes": [
    { "name": "S", "value": "S", "inStock": true },
    { "name": "M", "value": "M", "inStock": true }
  ],
  "attributes": {
    "Материал": "Хлопок",
    "Сезон": "Лето"
  }
}
```

## Схемы валидации

```typescript
// Схема для опции варианта
export const productVariantOptionSchema = z.object({
  option: z.string(),
  value: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

// Схема для варианта продукта
export const productVariantDetailSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  // ... другие поля
  options: z.array(productVariantOptionSchema).optional(), // Опции варианта
});

// Схема для создания опции варианта
export const createVariantOptionSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  values: z.array(z.string()).min(1, "Добавьте хотя бы одно значение"),
  productId: z.string().min(1, "ID продукта обязателен"),
  type: z.enum(["select", "color", "text", "number"]).default("select"),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Схема для добавления значения опции
export const addVariantOptionValueSchema = z.object({
  optionId: z.string().min(1, "ID опции обязателен"),
  value: z.string().min(1, "Значение обязательно"),
  displayName: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
```

## Рекомендации по улучшению

### 1. Улучшение названий переменных

```typescript
// ❌ Плохо - неясно, что это опции вариантов
const options = await getProductOptions(productId);

// ✅ Хорошо - четко указано, что это опции вариантов
const variantOptions = await getProductVariantOptions(productId);

// ❌ Плохо - неясно, что это атрибуты типа продукта
const attributes = await getProductAttributes(productId);

// ✅ Хорошо - четко указано, что это атрибуты типа продукта
const productTypeAttributes = await getProductTypeAttributes(productId);
```

### 2. Улучшение комментариев

```typescript
// ❌ Плохо - неясно, что получаем
const data = await getProductData(productId);

// ✅ Хорошо - четко указано назначение
// Получаем опции вариантов продукта (размер, цвет и т.д.)
const variantOptionsData = await getProductVariantOptions(productId);

// Получаем атрибуты типа продукта (материал, сезон и т.д.)
const productTypeAttributesData = await getProductTypeAttributes(productId);
```

### 3. Улучшение типов

```typescript
// ❌ Плохо - any тип
const variants = variants.map((variant: any) => ({ ... }));

// ✅ Хорошо - типизированные интерфейсы
interface ProductVariantWithOptions {
  id: string;
  name: string;
  optionCombinations: Array<{
    option: { name: string; slug: string; type: string };
    optionValue: { value: string; displayName: string; metadata?: Record<string, any> };
  }>;
}

const variants = variants.map((variant: ProductVariantWithOptions) => ({ ... }));
```

### 4. Улучшение обработки ошибок

```typescript
// ❌ Плохо - нет проверки на undefined
const categoryId = productCategoriesData[0]?.categoryId;
const category = await getCategory(categoryId);

// ✅ Хорошо - проверка на undefined
if (productCategoriesData.length > 0 && productCategoriesData[0]?.categoryId) {
  const category = await getCategory(productCategoriesData[0].categoryId);
}
```

## Миграция с старой архитектуры

### Проблемы старой архитектуры

1. **Смешивание концепций** - опции вариантов хранились в таблицах атрибутов типа продукта
2. **Неправильная нормализация** - значения опций дублировались для каждого продукта
3. **Сложность генерации вариантов** - не было четкой связи между опциями и вариантами

### Шаги миграции

1. **Создать новые таблицы** для опций вариантов
2. **Мигрировать данные** из старых таблиц
3. **Обновить API методы** для работы с новыми таблицами
4. **Обновить фронтенд** для использования новых API
5. **Удалить старые методы** (с deprecation warnings)

## Рекомендации

### Для разработчиков

1. **Всегда используйте четкие названия** - `variantOptions` vs `productTypeAttributes`
2. **Добавляйте подробные комментарии** - объясняйте назначение каждого блока кода
3. **Используйте типизацию** - избегайте `any` типов
4. **Проверяйте на undefined** - используйте optional chaining и null checks
5. **Следуйте принципу единственной ответственности** - разделяйте логику опций и атрибутов

### Для архитектуры

1. **Четкое разделение концепций** - опции вариантов vs атрибуты типа продукта
2. **Правильная нормализация** - избегайте дублирования данных
3. **Масштабируемость** - легко добавлять новые типы опций и атрибутов
4. **Производительность** - оптимизированные запросы с правильными индексами
5. **Типобезопасность** - строгая типизация на всех уровнях 