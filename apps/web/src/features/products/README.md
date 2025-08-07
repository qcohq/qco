# Модуль продуктов

Этот модуль предоставляет функциональность для работы с продуктами, используя tRPC API из `@qco/web-api`.

## Компоненты

### ProductCard
Карточка продукта с поддержкой сеточного и спискового отображения.

```tsx
import { ProductCard } from "@/features/products"

export function ProductGrid({ products }: { products: ProductItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### ProductRecommendations
Компонент для отображения рекомендуемых продуктов.

```tsx
import { ProductRecommendations } from "@/features/products"

export function ProductDetail({ productId, categorySlug }: { productId: string, categorySlug?: string }) {
  return (
    <div>
      {/* Детали продукта */}
      <ProductRecommendations 
        currentProductId={productId}
        categorySlug={categorySlug}
      />
    </div>
  )
}
```

### SearchResultsPage
Страница результатов поиска с фильтрацией и сортировкой.

```tsx
import { SearchResultsPage } from "@/features/products"

export default function SearchPage() {
  const searchQuery = "платье"
  const filters = {
    categoryId: "cat-1",
    brandId: "brand-1",
    minPrice: 1000,
    maxPrice: 50000,
    sort: "price-asc" as const
  }

  return <SearchResultsPage searchQuery={searchQuery} filters={filters} />
}
```

### CatalogPage
Страница каталога с фильтрами и сортировкой.

```tsx
import { CatalogPage } from "@/features/products"

export default function Catalog() {
  return <CatalogPage />
}
```

## Хуки

### useProductBySlug
Хук для получения продукта по slug.

```tsx
import { useProductBySlug } from "@/features/products"

export function ProductDetail({ slug }: { slug: string }) {
  const { product, isLoading, error } = useProductBySlug(slug)

  if (isLoading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error.message}</div>
  if (!product) return <div>Продукт не найден</div>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}
```

### useCatalogTRPC
Хук для работы с каталогом продуктов с фильтрацией и сортировкой.

```tsx
import { useCatalogTRPC } from "@/features/products"

export function Catalog() {
  const { 
    filteredProducts, 
    isLoading, 
    error, 
    filters, 
    updateFilter,
    sortBy,
    setSortBy 
  } = useCatalogTRPC("odezhda", "zhenskaya-odezhda")

  return (
    <div>
      {/* Фильтры и сортировка */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### useRecommendedProducts
Хук для получения рекомендуемых продуктов.

```tsx
import { useRecommendedProducts } from "@/features/products"

export function Recommendations({ currentProductId }: { currentProductId: string }) {
  const { recommendedProducts, isLoading } = useRecommendedProducts({
    currentProductId,
    limit: 4,
    categorySlug: "odezhda"
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### useProductSearch
Хук для поиска продуктов.

```tsx
import { useProductSearch } from "@/features/products"

export function Search({ query }: { query: string }) {
  const { products, totalCount, isLoading } = useProductSearch({
    query,
    categoryId: "cat-1",
    brandId: "brand-1",
    minPrice: 1000,
    maxPrice: 50000,
    sort: "relevance"
  })

  return (
    <div>
      <p>Найдено: {totalCount} товаров</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

## API Endpoints

Модуль использует следующие tRPC endpoints из `@qco/web-api`:

### GET /api/trpc/products.getBySlug
Получение продукта по slug.

**Параметры:**
```typescript
{
  slug: string
}
```

### GET /api/trpc/products.getByCategory
Получение продуктов по категории.

**Параметры:**
```typescript
{
  categorySlug: string
  limit?: number
  offset?: number
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular"
}
```

### GET /api/trpc/products.search
Поиск продуктов.

**Параметры:**
```typescript
{
  query: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  sort?: "relevance" | "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc"
  limit?: number
  offset?: number
  inStock?: boolean
  onSale?: boolean
}
```

### GET /api/trpc/products.getFeatured
Получение избранных продуктов.

**Параметры:**
```typescript
{
  limit?: number
}
```

## Особенности реализации

### Кэширование
- Используется React Query для кэширования данных
- `staleTime`: 5 минут для большинства запросов
- `gcTime`: 10 минут
- `refetchOnWindowFocus`: false

### Адаптация данных
- Все данные из API адаптируются в формат `ProductItem` для совместимости с компонентами
- Поддерживается fallback для отсутствующих полей

### Состояния загрузки
- Все хуки предоставляют состояния `isLoading`/`isPending`
- Компоненты отображают skeleton загрузки
- Обработка ошибок с возможностью повтора

### Фильтрация и сортировка
- Поддержка множественных фильтров (бренд, цена, размер, цвет)
- Сортировка по различным критериям
- URL-параметры для сохранения состояния фильтров

## Требования

- Должен быть настроен `TRPCProvider` в корне приложения
- Необходим пакет `@qco/web-api` с настроенными роутерами продуктов
- Поддержка React Query для кэширования 