# Руководство по разработке frontend для web-приложения

## Архитектура и структура проекта

### Основные принципы организации

#### 📁 Структура директорий
```
apps/web/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── (auth)/            # Группы маршрутов
│   │   ├── (store)/           # Основной магазин
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   └── cart/
│   │   ├── globals.css        # Глобальные стили Tailwind
│   │   └── layout.tsx         # Корневой layout
│   ├── features/              # Функциональные модули
│   │   └── [feature-name]/
│   │       ├── components/    # React компоненты
│   │       ├── hooks/         # React хуки
│   │       ├── utils/         # Утилиты
│   │       └── pages/         # Страничные компоненты
│   ├── components/           # Общие компоненты
│   ├── lib/                 # Утилиты и хелперы
│   └── trpc/                # tRPC клиент
├── public/                  # Статические файлы
└── package.json
```

#### 🎯 Разделение ответственности
- **Серверные компоненты** (`app/`): получение данных, SEO, метаданные
- **Клиентские компоненты** (`features/`): интерактивность, состояние, формы
- **UI компоненты** (`@qco/ui`): базовые элементы дизайн-системы

### Типизация и схемы

#### 📊 Использование Zod-схем
- **ВСЕ типы данных** экспортируются из `@qco/web-validators`
- Используйте типы напрямую из `@qco/web-validators`
- Единообразие типов между frontend и backend

### UI и стилизация

#### 🎨 Компоненты и стили
- **ВСЕ UI элементы** из `@qco/ui` (shadcn/ui)
- **Tailwind CSS 4** для стилизации
- **Lucide React** для иконок

#### ✨ Skeleton загрузки
- Обязательные shimmer-эффекты с плавной анимацией
- Skeleton-компоненты должны быть в `components/` соответствующей feature
- Отдельные компоненты для каждого типа контента
- Используйте компоненты из `@qco/ui/components/skeleton`

## Работа с данными через tRPC

### Серверные компоненты
- Используйте серверные компоненты для первичной загрузки данных
- Данные подготавливаются через tRPC процедуры на сервере
- Передавайте данные в клиентские компоненты через props

### Клиентские компоненты с tRPC
- Используйте хук `useTRPC()` для доступа к tRPC процедурам
- Применяйте `queryOptions()` и `mutationOptions()` для конфигурации запросов
- Все запросы должны быть инкапсулированы в хуки в папке `hooks/`

### Обработка состояния загрузки
- Используйте skeleton-компоненты для всех асинхронных операций
- Применяйте Suspense для управления состоянием загрузки
- Обеспечьте плавные переходы между состояниями

## Правила создания компонентов

### 1. Серверные страницы (App Router)
- Используйте Suspense для оборачивания клиентских компонентов
- Передавайте skeleton-компоненты в fallback
- Получайте данные через tRPC на сервере

### 2. Страничные компоненты (в features)
- Используйте "use client" директиву
- Инкапсулируйте логику работы с tRPC в хуки
- Обрабатывайте состояния загрузки, ошибок и пустых данных

### 3. Компоненты
- Используйте типы напрямую из `@qco/web-validators`
- Применяйте "use client" для интерактивных компонентов
- Следуйте принципу единственной ответственности

### 4. Хуки
- Все tRPC запросы должны быть в хуках
- Используйте `queryOptions` и `mutationOptions` для конфигурации
- Инкапсулируйте логику инвалидации кэша

### 5. Skeleton-компоненты
- Создавайте отдельные skeleton для каждого типа контента
- Используйте компоненты из `@qco/ui/components/skeleton`
- Обеспечивайте плавные анимации загрузки

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
- React и Next.js
- Внешние библиотеки
- UI компоненты из `@qco/ui` (ОБЯЗАТЕЛЬНО)
- Типы и схемы из `@qco/web-validators` (ОБЯЗАТЕЛЬНО)
- Внутренние компоненты (по алфавиту)
- Хуки и утилиты

### 2. Абсолютные пути
- Используйте `@/` для импортов из `src/`
- Используйте `@qco/ui` для ВСЕХ UI компонентов
- Используйте `@qco/web-validators` для ВСЕХ типов и схем

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
- **Схемы валидации должны быть из `@qco/web-validators`**
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

## Примеры для web-приложения

### Полный пример feature

```tsx
// Типы импортируются напрямую из @qco/web-validators
// Никаких дополнительных файлов types не нужно

// apps/web/src/features/products/hooks/use-product.ts
"use client"

import { useTRPC } from "@/trpc/react"
import { useQuery } from "@tanstack/react-query"

export function useProduct(slug: string) {
  const trpc = useTRPC()
  const productQueryOptions = trpc.products.getBySlug.queryOptions({ slug })
  
  return useQuery(productQueryOptions)
}

// apps/web/src/features/products/components/product-card.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@qco/ui/components/card"
import { Button } from "@qco/ui/components/button"
import type { Product } from "@qco/web-validators"

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

// apps/web/src/features/products/components/product-skeleton.tsx
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

// apps/web/src/features/products/pages/product-page.tsx
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

// apps/web/src/app/(store)/products/[slug]/page.tsx
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
