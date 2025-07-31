# Product Listing Feature

Модуль для отображения и управления списком продуктов с фильтрацией, сортировкой и массовыми операциями.

## Структура модуля

```
product-listing/
├── components/          # UI компоненты
│   ├── brand-filter.tsx
│   ├── bulk-actions.tsx
│   ├── bulk-delete-dialog.tsx
│   ├── compact-product-list.tsx
│   ├── delete-product-dialog.tsx
│   ├── empty-products-state.tsx
│   ├── enhanced-skeleton.tsx
│   ├── pagination-skeleton.tsx
│   ├── price-range-filter.tsx
│   ├── product-filters.tsx
│   ├── product-filters-skeleton.tsx
│   ├── product-grid.tsx
│   ├── product-table.tsx
│   ├── product-table-skeleton.tsx
│   ├── product-tile.tsx
│   ├── products-compact-view.tsx
│   ├── products-grid-view.tsx
│   ├── products-header.tsx
│   ├── products-page-content.tsx
│   ├── products-page-skeleton.tsx
│   ├── products-pagination.tsx
│   └── products-view-modes.tsx
├── hooks/              # Хуки для работы с данными
│   ├── use-categories.ts
│   └── use-products-list.ts
├── utils/              # Утилиты
│   └── filter-utils.ts
├── pages/              # Страничные компоненты
│   └── product-listing-page.tsx
├── types/              # Типы и схемы
│   └── index.ts
├── types.ts            # Дополнительные типы
└── index.ts            # Экспорты модуля
```

## Основные компоненты

### ProductsPageContent

Основной компонент для отображения списка продуктов с фильтрами и пагинацией.

```tsx
import { ProductsPageContent } from "@/features/product-listing";

<ProductsPageContent />
```

### ProductTable

Таблица для отображения продуктов с возможностью сортировки и массовых операций.

```tsx
import { ProductTable } from "@/features/product-listing";

<ProductTable
  products={products}
  selectedProducts={selectedProducts}
  onSelectProduct={handleSelectProduct}
  sortConfig={sortConfig}
  onSortChange={handleSortChange}
  onProductDeleted={handleProductDeleted}
/>
```

### ProductFilters

Компонент фильтров для поиска и фильтрации продуктов.

```tsx
import { ProductFilters } from "@/features/product-listing";

<ProductFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  onSortChange={handleSortChange}
  sortConfig={sortConfig}
  categories={categories}
/>
```

### BulkActions

Компонент для массовых операций с выбранными продуктами.

```tsx
import { BulkActions } from "@/features/product-listing";

<BulkActions
  selectedProducts={selectedProducts}
  allProducts={products}
  onSelectAll={handleSelectAll}
  onBulkAction={handleBulkAction}
  onProductsDeleted={handleProductsDeleted}
/>
```

## Хуки

### useProductsList

Хук для получения списка продуктов с фильтрацией и пагинацией.

```tsx
import { useProductsList } from "@/features/product-listing";

const { data, error, isLoading } = useProductsList(
  filters,
  page,
  pageSize,
  sortConfig
);
```

### useCategories

Хук для получения списка категорий.

```tsx
import { useCategories } from "@/features/product-listing";

const { data: categories } = useCategories();
```

## Утилиты

### filter-utils

Утилиты для фильтрации и сортировки продуктов.

```tsx
import { filterProducts, sortProducts } from "@/features/product-listing";

const filteredProducts = filterProducts(products, filters);
const sortedProducts = sortProducts(filteredProducts, sortOption);
```

## Страницы

### ProductListingPage

Страничный компонент с Suspense для отображения списка продуктов.

```tsx
import { ProductListingPage } from "@/features/product-listing";

<ProductListingPage />
```

## Zod Схемы

### filterStateSchema

Схема для валидации состояния фильтров:

```tsx
const filterStateSchema = z.object({
  search: z.string(),
  category: z.string(),
  status: z.string(),
  inStock: z.boolean(),
  onSale: z.boolean(),
  categories: z.array(z.string()),
  brands: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  minPrice: z.number(),
  maxPrice: z.number(),
});
```

## Типы

Все типы выводятся из Zod схем или импортируются из `@qco/validators`:

```tsx
// Типы из валидаторов
export type Product = ProductItem;
export type { ProductItem, ProductTableSortConfig } from "@qco/validators";

// Типы из локальных схем
export type FilterState = z.infer<typeof filterStateSchema>;
```

## Использование

### Импорт компонентов

```tsx
import { 
  ProductsPageContent,
  ProductTable,
  ProductFilters,
  BulkActions 
} from "@/features/product-listing";
```

### Импорт хуков и утилит

```tsx
import { 
  useProductsList,
  useCategories,
  filterProducts,
  sortProducts 
} from "@/features/product-listing";
```

### Импорт типов

```tsx
import { 
  FilterState,
  ProductItem,
  ProductTableSortConfig 
} from "@/features/product-listing";
```

## Соответствие правилам проекта

✅ **UI компоненты из @qco/ui** - все импорты корректные  
✅ **Skeleton-компоненты** - есть множество skeleton компонентов  
✅ **Структура features** - есть components, hooks, utils, types, pages  
✅ **Абсолютные пути** - используются @/ и @qco/ui  
✅ **Клиентские компоненты** - "use client" только где нужен интерактив  
✅ **Типы из Zod схем** - все типы выводятся из Zod схем или из @qco/validators  
✅ **Нет дублирующих типов** - все типы из Zod схем  
✅ **Серверные страницы** - есть ProductListingPage с Suspense  

## Особенности

- **Фильтрация**: поддержка поиска, фильтров по категориям, статусу, наличию
- **Сортировка**: сортировка по названию, цене, наличию, дате создания
- **Массовые операции**: удаление, архивирование, дублирование, экспорт
- **Пагинация**: поддержка пагинации с настраиваемым размером страницы
- **Skeleton-компоненты**: красивые skeleton для всех состояний загрузки
- **Типобезопасность**: все типы выводятся из Zod схем
- **Доступность**: использование компонентов shadcn/ui для accessibility
- **Консистентность**: единообразная структура всех компонентов 