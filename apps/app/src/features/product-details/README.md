# Product Details Feature

Модуль для отображения и редактирования деталей продуктов с использованием Zod схем для валидации.

> **Примечание**: Компоненты этого модуля готовы к использованию, но пока не интегрированы в основное приложение. Они соответствуют всем правилам проекта и могут быть легко подключены.

## Структура модуля

```
product-details/
├── components/          # UI компоненты
│   ├── product-details.tsx
│   ├── product-edit-form.tsx
│   ├── product-gallery.tsx
│   └── product-details-skeleton.tsx
├── hooks/              # Хуки для работы с данными
│   └── use-product-details.ts
├── utils/              # Утилиты
│   └── price-utils.ts
├── pages/              # Страничные компоненты
│   └── product-details-page.tsx
├── types/              # Типы и схемы
│   └── index.ts
└── index.ts            # Экспорты модуля
```

## Компоненты

### ProductDetails

Компонент для отображения полной информации о продукте.

```tsx
import { ProductDetails } from "@/features/product-details";

<ProductDetails product={productData} />
```

**Props:**
- `product: Product` - объект продукта с полной информацией

### ProductGallery

Компонент для отображения галереи изображений продукта с поддержкой цветовых вариантов.

```tsx
import { ProductGallery } from "@/features/product-details";

const images = [
  {
    url: "https://example.com/image1.jpg",
    color: "red",
    isDefault: true,
  },
  {
    url: "https://example.com/image2.jpg",
    color: "blue",
    isDefault: false,
  },
];

<ProductGallery images={images} productName="Product Name" />
```

**Props:**
- `images: ColorImage[]` - массив изображений с цветовой информацией
- `productName: string` - название продукта

### ProductEditForm

Форма для редактирования информации о продукте с валидацией через Zod.

```tsx
import { ProductEditForm } from "@/features/product-details";

const handleSubmit = (data: ProductEditFormData) => {
  // Обработка данных формы
  console.log(data);
};

<ProductEditForm 
  product={productData} 
  onSubmit={handleSubmit}
  isLoading={false}
/>
```

**Props:**
- `product: Product` - объект продукта для редактирования
- `onSubmit: (data: ProductEditFormData) => void` - функция обработки отправки формы
- `isLoading?: boolean` - состояние загрузки (опционально)

### ProductDetailsSkeleton

Skeleton-компонент для отображения во время загрузки данных.

```tsx
import { ProductDetailsSkeleton } from "@/features/product-details";

<ProductDetailsSkeleton />
```

## Хуки

### useProductDetails

Хук для получения данных продукта.

```tsx
import { useProductDetails } from "@/features/product-details";

const { product, isLoading, error } = useProductDetails(productId);
```

## Утилиты

### price-utils

Утилиты для работы с ценами продуктов.

```tsx
import { 
  isProductOnSale, 
  getCurrentPrice, 
  getOriginalPrice,
  calculateDiscountPercent 
} from "@/features/product-details";

const onSale = isProductOnSale(product);
const currentPrice = getCurrentPrice(product);
const originalPrice = getOriginalPrice(product);
const discountPercent = calculateDiscountPercent(basePrice, salePrice);
```

## Страницы

### ProductDetailsPage

Страничный компонент для отображения деталей продукта с обработкой состояний загрузки и ошибок.

```tsx
import { ProductDetailsPage } from "@/features/product-details";

<ProductDetailsPage productId="product-123" />
```

### ProductDetailsPageServer

Серверный компонент-обертка с Suspense.

```tsx
import { ProductDetailsPageServer } from "@/features/product-details";

<ProductDetailsPageServer productId="product-123" />
```

## Zod Схемы

### Локальные схемы (в types/index.ts)

#### colorImageSchema

Схема для валидации изображения продукта:

```tsx
const colorImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  color: z.string().min(1, "Color is required"),
  isDefault: z.boolean().optional(),
});
```

#### productGallerySchema

Схема для валидации пропсов галереи:

```tsx
const productGallerySchema = z.object({
  images: z.array(colorImageSchema).min(1, "At least one image is required"),
  productName: z.string().min(1, "Product name is required"),
});
```

#### productDetailsSchema

Схема для валидации данных продукта:

```tsx
const productDetailsSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string().min(1, "Product name is required"),
    slug: z.string(),
    description: z.string().nullable(),
    basePrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    // ... другие поля
  }),
});
```

### Схемы из @qco/validators

#### productEditFormSchema

Схема для валидации формы редактирования (из `@qco/validators`):

```tsx
const productEditFormSchema = z.object({
  name: z.string().min(2, { message: "Product name must contain at least 2 characters" }),
  description: z.string().optional(),
  basePrice: z.number().min(0, { message: "Base price must be non-negative" }).optional(),
  salePrice: z.number().min(0, { message: "Sale price must be non-negative" }).optional(),
  stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }).optional(),
  sku: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
  isNew: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
}).refine((data) => {
  if (data.salePrice && data.basePrice && data.salePrice >= data.basePrice) {
    return false;
  }
  return true;
}, {
  message: "Sale price must be less than base price",
  path: ["salePrice"],
});
```

## Типы

Все типы выведены из Zod схем для обеспечения типобезопасности:

```tsx
// Локальные типы
export type ColorImage = z.infer<typeof colorImageSchema>;
export type ProductFile = z.infer<typeof productFileSchema>;
export type ProductGalleryProps = z.infer<typeof productGallerySchema>;
export type ProductDetailsProps = z.infer<typeof productDetailsSchema>;

// Типы из @qco/validators
export type ProductEditFormData = z.infer<typeof productEditFormSchema>;
```

## Использование

### Импорт компонентов

```tsx
import { 
  ProductDetails, 
  ProductGallery, 
  ProductEditForm,
  ProductDetailsSkeleton 
} from "@/features/product-details";
```

### Импорт хуков и утилит

```tsx
import { 
  useProductDetails,
  isProductOnSale,
  getCurrentPrice 
} from "@/features/product-details";
```

### Импорт типов и схем

```tsx
import { 
  ProductDetailsProps,
  productDetailsSchema,
  type ColorImage 
} from "@/features/product-details/types";

import { ProductEditFormData } from "@qco/validators";
```

## Валидация

Все компоненты используют Zod схемы для валидации входных данных:

1. **ProductGallery** - валидирует массив изображений и название продукта
2. **ProductDetails** - валидирует полный объект продукта
3. **ProductEditForm** - валидирует данные формы с помощью React Hook Form и схемы из `@qco/validators`

При ошибках валидации компоненты отображают сообщения об ошибках и предотвращают рендеринг некорректных данных.

## Соответствие правилам проекта

✅ **Типы из Zod схем** - все типы выводятся из Zod схем  
✅ **UI компоненты из @qco/ui** - все импорты корректные  
✅ **Формы с react-hook-form + zodResolver** - используется в ProductEditForm  
✅ **Skeleton-компоненты** - есть ProductDetailsSkeleton  
✅ **Структура features** - есть components, hooks, utils, types, pages  
✅ **Абсолютные пути** - используются @/ и @qco/ui  
✅ **Нет дублирующих типов** - все типы из Zod схем  
✅ **Клиентские компоненты** - "use client" только где нужен интерактив  
✅ **Серверные страницы** - есть ProductDetailsPageServer  
✅ **Схемы из валидаторов** - ProductEditForm использует схему из @qco/validators  

## Особенности

- **Типобезопасность**: все типы выведены из Zod схем
- **Валидация**: автоматическая валидация входных данных
- **Обработка ошибок**: graceful handling ошибок валидации
- **Доступность**: использование компонентов shadcn/ui для accessibility
- **Консистентность**: единообразная структура всех компонентов
- **Готовность к использованию**: все компоненты готовы для интеграции в проект
- **Централизованные схемы**: формы используют схемы из @qco/validators 