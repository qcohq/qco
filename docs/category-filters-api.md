# API для получения доступных фильтров по категории

## Описание

Новый API эндпоинт `getCategoryFilters` позволяет получать только те размеры, цвета, бренды и ценовые диапазоны, которые действительно доступны для товаров в конкретной категории каталога.

## Мотивация

Ранее фильтры показывали все возможные размеры и цвета, независимо от того, есть ли товары с такими характеристиками в выбранной категории. Это создавало плохой пользовательский опыт - пользователи выбирали фильтры, но не видели результатов.

Новый API решает эту проблему, предоставляя только релевантные фильтры для каждой категории.

## API Эндпоинт

### Запрос

```typescript
// Схема входных данных
{
  categorySlug: string // slug категории или "all" для всех товаров
}
```

### Ответ

```typescript
// Схема ответа
{
  sizes: string[];           // Доступные размеры
  colors: string[];          // Доступные цвета
  brands: string[];          // Доступные бренды
  priceRange: {              // Ценовой диапазон
    min: number;
    max: number;
  };
  totalProducts: number;     // Общее количество товаров в категории
}
```

### Примеры использования

#### Backend (tRPC)

```typescript
// packages/web-api/src/router/products/get-category-filters.ts
export const getCategoryFilters = publicProcedure
  .input(getCategoryFiltersSchema)
  .output(getCategoryFiltersResponseSchema)
  .query(async ({ ctx, input }) => {
    // ... реализация
  });
```

#### Frontend Hook

```typescript
// apps/web/src/features/products/hooks/use-category-filters.ts
import { useCategoryFilters } from "../hooks/use-category-filters";

function CatalogPage({ categorySlug }: { categorySlug: string }) {
  const { filters, isPending, hasFilters } = useCategoryFilters(categorySlug);

  if (isPending) return <FiltersSkeleton />;
  if (!hasFilters) return <NoFiltersMessage />;

  return (
    <div>
      <h3>Доступные размеры: {filters.sizes.join(", ")}</h3>
      <h3>Доступные цвета: {filters.colors.join(", ")}</h3>
      <h3>Доступные бренды: {filters.brands.join(", ")}</h3>
      <h3>Цены: {filters.priceRange.min} - {filters.priceRange.max} ₽</h3>
      <h3>Всего товаров: {filters.totalProducts}</h3>
    </div>
  );
}
```

#### Компонент фильтров

```typescript
// apps/web/src/features/products/components/product-filters-panel-dynamic.tsx
import { useCategoryFilters } from "../hooks/use-category-filters";

function ProductFiltersPanelDynamic({ categorySlug }: { categorySlug: string }) {
  const { filters: availableFilters, isPending } = useCategoryFilters(categorySlug);

  return (
    <div>
      {/* Показываем только доступные размеры */}
      {availableFilters.sizes.map((size) => (
        <SizeFilter key={size} size={size} />
      ))}
      
      {/* Показываем только доступные цвета */}
      {availableFilters.colors.map((color) => (
        <ColorFilter key={color} color={color} />
      ))}
      
      {/* Ценовой слайдер с реальными границами */}
      <PriceSlider
        min={availableFilters.priceRange.min}
        max={availableFilters.priceRange.max}
      />
    </div>
  );
}
```

## Преимущества нового подхода

### 1. Улучшенный UX
- Пользователи видят только релевантные фильтры
- Нет ситуаций, когда фильтр не дает результатов
- Показывается реальное количество товаров

### 2. Производительность
- Отдельный быстрый API запрос
- Возможность кеширования результатов
- Минимальная нагрузка на базу данных

### 3. Масштабируемость
- Легко добавить новые типы фильтров
- Поддержка любых атрибутов товаров
- Гибкая архитектура

## Техническая реализация

### База данных

Эндпоинт работает с несколькими таблицами:

1. `products` - основная таблица товаров
2. `product_categories` - связь товаров с категориями  
3. `product_attribute_values` - значения атрибутов товаров
4. `product_type_attributes` - определения атрибутов
5. `brands` - таблица брендов
6. `categories` - таблица категорий

### Оптимизация запросов

- Использование параллельных запросов с `Promise.all()`
- Индексы на ключевых полях для быстрого поиска
- Агрегация данных на уровне БД

### Кеширование

Результаты API можно кешировать с помощью:

```typescript
// React Query автоматически кеширует результаты
const { filters } = useCategoryFilters(categorySlug);

// Ручное управление кешем
queryClient.setQueryData(
  ['categoryFilters', categorySlug],
  cachedData
);
```

## Миграция существующих компонентов

### До

```typescript
// Статичные фильтры
const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["black", "white", "red"];

function Filters() {
  return (
    <div>
      {sizes.map(size => <SizeOption key={size} size={size} />)}
      {colors.map(color => <ColorOption key={color} color={color} />)}
    </div>
  );
}
```

### После

```typescript
// Динамические фильтры
function Filters({ categorySlug }: { categorySlug: string }) {
  const { filters, isPending } = useCategoryFilters(categorySlug);
  
  if (isPending) return <Skeleton />;
  
  return (
    <div>
      {filters.sizes.map(size => <SizeOption key={size} size={size} />)}
      {filters.colors.map(color => <ColorOption key={color} color={color} />)}
    </div>
  );
}
```

## Дальнейшие улучшения

1. **Кеширование на уровне сервера** - Redis/Memcached
2. **Фоновое обновление кеша** - при изменении товаров
3. **Поддержка дополнительных атрибутов** - материал, сезон и т.д.
4. **Аналитика фильтров** - отслеживание популярности
5. **A/B тестирование** - сравнение эффективности разных подходов

## Заключение

Новый API эндпоинт `getCategoryFilters` значительно улучшает пользовательский опыт каталога, показывая только релевантные фильтры для каждой категории. Реализация обеспечивает высокую производительность и легко расширяется для новых требований. 