# Интеграция категорий с типами продуктов

Этот документ описывает систему связи категорий каталога с типами продуктов для динамического отображения атрибутов в фильтрах.

## Обзор

Система позволяет:
- Связать категории с типами продуктов
- Автоматически отображать соответствующие атрибуты в фильтрах
- Фильтровать продукты по атрибутам типа продукта
- Обеспечить гибкую и масштабируемую систему фильтрации

## Архитектура

### База данных

#### Таблица `category_product_types`
```sql
CREATE TABLE category_product_types (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES categories(id),
    product_type_id TEXT NOT NULL REFERENCES product_types(id),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category_id, product_type_id)
);
```

**Поля:**
- `category_id` - ID категории
- `product_type_id` - ID типа продукта
- `is_primary` - Основной тип продукта для категории
- `sort_order` - Порядок сортировки

### Схемы валидации

#### `packages/web-validators/src/category-attributes.ts`
```typescript
export const categoryAttributeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    options: z.array(z.string()),
    isFilterable: z.boolean(),
    sortOrder: z.number(),
    isRequired: z.boolean(),
    isActive: z.boolean(),
});
```

## API

### Получение атрибутов по категории

**Роут:** `GET /api/trpc/products.getAttributesByCategory`

**Входные данные:**
```typescript
{
    categorySlug: string
}
```

**Ответ:**
```typescript
CategoryAttribute[]
```

**Логика:**
1. Находит категорию по slug
2. Получает связанные типы продуктов
3. Извлекает фильтруемые атрибуты
4. Возвращает отсортированный список

## Фронтенд

### Хуки

#### `useCategoryAttributes`
```typescript
export function useCategoryAttributes(categorySlug?: string) {
    // Возвращает атрибуты для указанной категории
    return {
        attributes: CategoryAttribute[],
        isLoading: boolean,
        error: Error | null,
    };
}
```

### Компоненты

#### `DynamicAttributeFilter`
Отображает фильтр для конкретного атрибута:
- Чекбоксы для выбора значений
- Индикатор активных фильтров
- Сворачиваемый интерфейс

#### `ProductFiltersPanel`
Обновлен для поддержки динамических атрибутов:
- Автоматически загружает атрибуты по категории
- Отображает секцию "Характеристики"
- Поддерживает скелетон загрузки

### Фильтрация

#### Обновленные типы
```typescript
export interface CatalogFilters {
    // ... существующие поля
    attributes: Record<string, string[]>; // Динамические атрибуты
}
```

#### Логика фильтрации
```typescript
// Фильтр по атрибутам
const activeAttributes = Object.entries(filters.attributes).filter(
    ([_, values]) => values.length > 0
);

if (activeAttributes.length > 0) {
    filtered = filtered.filter((product) => {
        return activeAttributes.every(([attributeSlug, selectedValues]) => {
            const productAttributeValue = product.attributes?.[attributeSlug];
            if (!productAttributeValue) return false;
            return selectedValues.includes(productAttributeValue);
        });
    });
}
```

## Настройка

### 1. Создание типов продуктов

В админке создайте типы продуктов:
- **Одежда** (`clothing`)
- **Обувь** (`shoes`)
- **Аксессуары** (`accessories`)
- **Красота** (`beauty`)

### 2. Добавление атрибутов

Для каждого типа продукта добавьте атрибуты:
- **Материал** (select: хлопок, шелк, полиэстер)
- **Сезон** (select: весна, лето, осень, зима)
- **Пол** (select: мужской, женский, унисекс)
- **Бренд** (select: список брендов)

**Важно:** Отметьте атрибуты как `isFilterable: true`

### 3. Связывание с категориями

Создайте связи в таблице `category_product_types`:
```sql
-- Женская одежда
INSERT INTO category_product_types (category_id, product_type_id, is_primary) 
VALUES ('women-category-id', 'clothing-type-id', true);

-- Мужская одежда  
INSERT INTO category_product_types (category_id, product_type_id, is_primary)
VALUES ('men-category-id', 'clothing-type-id', true);
```

### 4. Заполнение тестовых данных

Запустите скрипт заполнения:
```bash
bun run db:seed:category-product-types
```

## Использование

### В админке

1. **Управление типами продуктов:**
   - Создайте типы продуктов
   - Добавьте атрибуты с флагом `isFilterable`
   - Настройте опции для select/multiselect атрибутов

2. **Связывание с категориями:**
   - В интерфейсе категорий добавьте возможность выбора типов продуктов
   - Укажите основной тип продукта для категории

### На фронтенде

1. **Автоматическое отображение фильтров:**
   - При переходе в категорию автоматически загружаются атрибуты
   - Отображаются только фильтруемые атрибуты
   - Показываются только активные атрибуты

2. **Фильтрация:**
   - Пользователи могут выбирать значения атрибутов
   - Фильтры применяются в реальном времени
   - Поддерживается множественный выбор

## Преимущества

1. **Гибкость:** Легко добавлять новые типы продуктов и атрибуты
2. **Масштабируемость:** Система работает с любым количеством категорий
3. **Производительность:** Атрибуты загружаются только для нужной категории
4. **UX:** Пользователи видят только релевантные фильтры
5. **Типобезопасность:** Полная типизация на всех уровнях

## Расширение

### Добавление новых типов атрибутов

1. Обновите схему `productTypeAttributes.type`
2. Добавьте обработку в компонент `DynamicAttributeFilter`
3. Обновите логику фильтрации

### Кастомные фильтры

Создайте специализированные компоненты фильтров:
```typescript
// Цветовой фильтр с превью
export function ColorAttributeFilter({ attribute, filters, onFilterChange }) {
    // Кастомная логика для цветов
}

// Диапазонный фильтр
export function RangeAttributeFilter({ attribute, filters, onFilterChange }) {
    // Кастомная логика для диапазонов
}
```

## Отладка

### Проверка связей

```sql
-- Проверить связи категорий с типами продуктов
SELECT 
    c.name as category_name,
    pt.name as product_type_name,
    cpt.is_primary
FROM category_product_types cpt
JOIN categories c ON c.id = cpt.category_id
JOIN product_types pt ON pt.id = cpt.product_type_id;
```

### Проверка атрибутов

```sql
-- Проверить фильтруемые атрибуты
SELECT 
    pt.name as product_type,
    pta.name as attribute_name,
    pta.is_filterable,
    pta.options
FROM product_type_attributes pta
JOIN product_types pt ON pt.id = pta.product_type_id
WHERE pta.is_filterable = true;
```

### Логирование

Включите логирование в API роуте:
```typescript
console.log("Category:", categorySlug);
console.log("Product types:", productTypeIds);
console.log("Attributes:", attributes);
``` 