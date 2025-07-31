# Правила написания фронтенда

## Общие принципы

### 1. Архитектура на основе features
- Все компоненты должны быть организованы в папке `features` по функциональности
- Каждая feature должна содержать: `components/`, `hooks/`, `utils/`, `pages/`
- Серверные страницы (App Router) должны быть в `src/app/` и использовать компоненты из features

### 2. Серверные страницы (App Router)
- Все страницы в `src/app/` должны быть серверными компонентами по умолчанию
- Используйте `"use client"` только когда необходимо
- Серверные страницы должны подготавливать данные и передавать их в клиентские компоненты

### 3. Разделение ответственности
- **Серверные страницы**: получение данных, SEO, метаданные, layout
- **Клиентские компоненты**: интерактивность, состояние, события пользователя

### 4. Типизация и схемы
- **ВСЕ типы данных должны генерироваться на основе Zod-схем** из пакета `@qco/validators` (или `@qco/web-validators` для web)
- Не создавайте дублирующие типы вручную — используйте `z.infer<typeof schema>`
- Схемы валидации должны импортироваться из общего пакета, чтобы типы были едины между фронтом и беком

### 5. UI-компоненты
- **ВСЕ базовые UI-элементы** (Button, Input, Card, Select, Checkbox, Switch, и т.д.) должны импортироваться **ТОЛЬКО** из пакета `@qco/ui`
- Не создавайте свои базовые кнопки, инпуты, чекбоксы и т.д. — только расширяйте или оборачивайте их при необходимости

### 6. Skeleton-компоненты
- **ВСЕГДА используйте красивые skeleton-компоненты** для загрузки данных (shimmer-эффекты, placeholder-карточки, анимации)
- Skeleton-компоненты должны быть отдельными файлами в `components/` соответствующей feature
- Для Suspense используйте skeleton как fallback
- Skeleton должен быть визуально приятным и переиспользуемым

### 4. Типизация и схемы
- **ВСЕ типы данных должны генерироваться на основе Zod-схем** из пакета `@qco/validators` (или `@qco/web-validators` для web)
- Не создавайте дублирующие типы вручную — используйте `z.infer<typeof schema>`
- Схемы валидации должны импортироваться из общего пакета, чтобы типы были едины между фронтом и беком

### 5. UI-компоненты
- **ВСЕ базовые UI-элементы** (Button, Input, Card, Select, Checkbox, Switch, и т.д.) должны импортироваться **ТОЛЬКО** из пакета `@qco/ui`
- Не создавайте свои базовые кнопки, инпуты, чекбоксы и т.д. — только расширяйте или оборачивайте их при необходимости

### 6. Skeleton-компоненты
- **ВСЕГДА используйте красивые skeleton-компоненты** для загрузки данных (shimmer-эффекты, placeholder-карточки, анимации)
- Skeleton-компоненты должны быть отдельными файлами в `components/` соответствующей feature
- Для Suspense используйте skeleton как fallback
- Skeleton должен быть визуально приятным и переиспользуемым

## Структура проекта

```
src/
├── app/                    # Next.js App Router (серверные страницы)
│   ├── cart/
│   │   └── page.tsx       # Серверная страница корзины
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx   # Серверная страница продукта
│   └── layout.tsx
├── features/              # Функциональные модули
│   ├── cart/
│   │   ├── components/    # Компоненты корзины
│   │   ├── hooks/         # Хуки корзины
│   │   ├── utils/         # Утилиты корзины
│   │   ├── types/         # Типы корзины (из Zod-схем)
│   │   └── pages/         # Страничные компоненты
│   └── products/
│       ├── components/    # Компоненты продуктов
│       ├── hooks/         # Хуки продуктов
│       ├── utils/         # Утилиты продуктов
│       ├── types/         # Типы продуктов (из Zod-схем)
│       └── pages/         # Страничные компоненты
└── components/            # Общие компоненты
    └── ui/               # UI компоненты (shadcn/ui)
```

## Правила создания компонентов

### 1. Серверные страницы (App Router)

```tsx
// src/app/cart/page.tsx
import { Suspense } from "react"
import { CartPage } from "@/features/cart/pages/cart-page"
import { CartSkeleton } from "@/features/cart/components/cart-skeleton"

export default async function CartPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<CartSkeleton />}>
          <CartPage />
        </Suspense>
      </main>
    </div>
  )
}
```

### 2. Страничные компоненты (в features)

```tsx
// src/features/cart/pages/cart-page.tsx
"use client"

import { useCart } from "@/features/cart/hooks/use-cart"
import { CartItems } from "@/features/cart/components/cart-items"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { CartSkeleton } from "@/features/cart/components/cart-skeleton"
import { CartError } from "@/features/cart/components/cart-error"
import { EmptyCart } from "@/features/cart/components/empty-cart"

export function CartPage() {
  const { cart, isLoading, error } = useCart()

  if (isLoading) return <CartSkeleton />
  if (error) return <CartError error={error} />
  if (!cart?.items.length) return <EmptyCart />

  return (
    <div className="space-y-8">
      <CartHeader itemCount={cart.items.length} />
      <div className="grid lg:grid-cols-3 gap-8">
        <CartItems items={cart.items} />
        <CartSummary cart={cart} />
      </div>
    </div>
  )
}
```

### 3. Компоненты

```tsx
// src/features/cart/components/cart-items.tsx
"use client"

import { CartItem } from "./cart-item"
import { z } from "zod"
import { cartItemSchema } from "@qco/validators"

type CartItemType = z.infer<typeof cartItemSchema>

interface CartItemsProps {
  items: CartItemType[]
}

export function CartItems({ items }: CartItemsProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  )
}
```

### 4. Хуки

```tsx
// src/features/cart/hooks/use-cart.ts
"use client"

import { useTRPC } from "@/trpc/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useCart() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const cartQueryOptions = trpc.cart.get.queryOptions()
  const { data: cart, isLoading, error } = useQuery(cartQueryOptions)

  const updateQuantityMutationOptions = trpc.cart.updateQuantity.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.cart.get.queryKey() })
    }
  })
  const { mutate: updateQuantity, isPending: isUpdating } = useMutation(updateQuantityMutationOptions)

  return {
    cart,
    isLoading,
    error,
    updateQuantity,
    isUpdating
  }
}
```

### 5. Skeleton-компоненты

```tsx
// src/features/cart/components/cart-skeleton.tsx
"use client"

import { Card, CardContent } from "@qco/ui/components/card"
import { Skeleton } from "@qco/ui/components/skeleton"

export function CartSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-32 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

## Правила именования

### 1. Файлы и папки
- **kebab-case** для файлов: `cart-item.tsx`, `use-cart.ts`
- **PascalCase** для компонентов: `CartItem`, `CartPage`
- **camelCase** для хуков: `useCart`, `useProductDetails`

### 2. Компоненты
- **Страничные компоненты**: `CartPage`, `ProductPage`
- **Контейнерные компоненты**: `CartItems`, `ProductList`
- **UI компоненты**: `CartItem`, `ProductCard`
- **Функциональные компоненты**: `AddToCartButton`, `QuantitySelector`
- **Skeleton компоненты**: `CartSkeleton`, `ProductSkeleton`

## Правила импортов

### 1. Порядок импортов
```tsx
// 1. React и Next.js
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// 2. Внешние библиотеки
import { useQuery } from "@tanstack/react-query"
import { z } from "zod"

// 3. UI компоненты из @qco/ui (ОБЯЗАТЕЛЬНО)
import { Button } from "@qco/ui/components/button"
import { Input } from "@qco/ui/components/input"
import { Card, CardContent } from "@qco/ui/components/card"
import { Skeleton } from "@qco/ui/components/skeleton"

// 4. Zod схемы из @qco/validators (ОБЯЗАТЕЛЬНО)
import { productSchema, cartItemSchema } from "@qco/validators"

// 5. Внутренние компоненты (по алфавиту)
import { CartItem } from "@/features/cart/components/cart-item"
import { ProductCard } from "@/features/products/components/product-card"

// 6. Хуки и утилиты
import { useCart } from "@/features/cart/hooks/use-cart"
import { formatPrice } from "@/features/cart/utils/price-formatting"

// 7. Типы (из Zod схем)
import type { Product } from "@qco/validators"
type CartItemType = z.infer<typeof cartItemSchema>
```

### 2. Абсолютные пути
- Используйте `@/` для импортов из `src/`
- Используйте `@qco/ui` для ВСЕХ UI компонентов
- Используйте `@qco/validators` для ВСЕХ типов и схем

## Правила состояния

### 1. Серверное состояние
- Используйте tRPC + React Query для серверного состояния
- Все запросы должны быть в хуках в папке `hooks/`
- Используйте `queryOptions` и `mutationOptions` для конфигурации

### 2. Клиентское состояние
- Используйте `useState` для локального состояния компонента
- Используйте `useReducer` для сложного состояния
- Используйте Context API для глобального состояния

### 3. Формы
- **ВСЕГДА используйте `react-hook-form` с `zodResolver`**
- **Схемы валидации должны быть из `@qco/validators`**
- Не создавайте свои схемы валидации

## Правила производительности

### 1. Оптимизация рендеринга
- Используйте `React.memo` для компонентов, которые часто перерендериваются
- Используйте `useMemo` и `useCallback` для дорогих вычислений
- Используйте `useTransition` для неблокирующих обновлений

### 2. Загрузка данных
- **ВСЕГДА используйте `Suspense` для загрузки компонентов**
- **Создавайте красивые skeleton-компоненты для улучшения UX**
- Используйте `prefetch` для предзагрузки данных

### 3. Изображения
- Всегда используйте `next/image` с оптимизацией
- Указывайте `sizes` для адаптивных изображений
- Используйте `placeholder="blur"` для плавной загрузки

## Правила доступности (Accessibility)

### 1. Семантика
- Используйте правильные HTML теги (`<main>`, `<section>`, `<article>`)
- Используйте `aria-*` атрибуты где необходимо
- Обеспечивайте правильную иерархию заголовков

### 2. Навигация
- Поддерживайте навигацию с клавиатуры
- Используйте `focus-visible` для стилизации фокуса
- Обеспечивайте пропуск повторяющихся блоков

### 3. Скринридеры
- Используйте `alt` для изображений
- Используйте `aria-label` для кнопок без текста
- Используйте `aria-describedby` для описаний

## Правила тестирования

### 1. Структура тестов
```
src/features/cart/
├── components/
│   ├── cart-item.tsx
│   └── __tests__/
│       └── cart-item.test.tsx
├── hooks/
│   ├── use-cart.ts
│   └── __tests__/
│       └── use-cart.test.ts
```

## Примеры

### Полный пример feature

```tsx
// src/features/products/types/product.ts
import { z } from "zod"
import { productSchema } from "@qco/validators"

export type Product = z.infer<typeof productSchema>

// src/features/products/hooks/use-product.ts
"use client"

import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"

export function useProduct(slug: string) {
  const trpc = useTRPC()
  const productQueryOptions = trpc.products.getBySlug.queryOptions({ slug })
  
  return useQuery(productQueryOptions)
}

// src/features/products/components/product-card.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@qco/ui/components/card"
import { Button } from "@qco/ui/components/button"
import type { Product } from "@qco/validators"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        </Link>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-lg font-bold">${product.price}</p>
        <Button className="w-full mt-2">Add to Cart</Button>
      </CardContent>
    </Card>
  )
}

// src/features/products/components/product-skeleton.tsx
"use client"

import { Card, CardContent, CardHeader } from "@qco/ui/components/card"
import { Skeleton } from "@qco/ui/components/skeleton"

export function ProductSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-full h-64 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

// src/features/products/pages/product-page.tsx
"use client"

import { useProduct } from "../hooks/use-product"
import { ProductDetails } from "../components/product-details"
import { ProductSkeleton } from "../components/product-skeleton"

interface ProductPageProps {
  slug: string
}

export function ProductPage({ slug }: ProductPageProps) {
  const { data: product, isLoading, error } = useProduct(slug)

  if (isLoading) return <ProductSkeleton />
  if (error) return <div>Error: {error.message}</div>
  if (!product) return <div>Product not found</div>

  return <ProductDetails product={product} />
}

// src/app/products/[slug]/page.tsx
import { Suspense } from "react"
import { ProductPage } from "@/features/products/pages/product-page"
import { ProductSkeleton } from "@/features/products/components/product-skeleton"

interface ProductPageProps {
  params: { slug: string }
}

export default function ProductPageServer({ params }: ProductPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductPage slug={params.slug} />
      </Suspense>
    </div>
  )
}
```


