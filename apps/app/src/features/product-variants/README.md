# Product Variants Feature

Модуль для управления вариантами продуктов с использованием форм React Hook Form и Zod валидации.

## Структура модуля

```
product-variants/
├── components/          # UI компоненты
│   ├── bulk-price-edit.tsx
│   ├── bulk-stock-edit.tsx
│   ├── generate-variants-dialog.tsx
│   ├── option-edit-dialog.tsx
│   ├── option-value-edit-dialog.tsx
│   ├── option-values-dialog.tsx
│   ├── options-dialog.tsx
│   ├── variant-edit-dialog.tsx
│   ├── variant-options-section.tsx
│   ├── variant-options-table.tsx
│   ├── variants-excel.tsx
│   ├── variants-list-section.tsx
│   ├── variants-list-skeleton.tsx
│   ├── variants-table.tsx
│   └── index.ts
├── hooks/              # Хуки для работы с данными
│   └── index.ts
├── utils/              # Утилиты
│   └── variant-utils.ts
├── pages/              # Страничные компоненты
│   └── product-variants-page.tsx
├── types/              # Типы и схемы
│   └── index.ts
├── api.ts              # API хуки
└── index.ts            # Экспорты модуля
```

## Основные компоненты

### VariantsListSection

Основной компонент для отображения списка вариантов продукта.

```tsx
import { VariantsListSection } from "@/features/product-variants";

<VariantsListSection productId={productId} />
```

### VariantEditDialog

Диалог для редактирования варианта продукта.

```tsx
import { VariantEditDialog } from "@/features/product-variants";

<VariantEditDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  variant={variant}
  productId={productId}
/>
```

### OptionsDialog

Диалог для создания новых опций продукта.

```tsx
import { OptionsDialog } from "@/features/product-variants";

<OptionsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  productId={productId}
/>
```

### BulkPriceEdit

Компонент для массового редактирования цен вариантов.

```tsx
import { BulkPriceEdit } from "@/features/product-variants";

<BulkPriceEdit
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  productId={productId}
/>
```

### GenerateVariantsDialog

Диалог для умной генерации вариантов продукта.

```tsx
import { GenerateVariantsDialog } from "@/features/product-variants";

<GenerateVariantsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  productId={productId}
  options={options}
/>
```

## Хуки

### useProductVariants

Хук для получения вариантов продукта.

```tsx
import { useProductVariants } from "@/features/product-variants";

const { variants, isLoading, isError, error } = useProductVariants(productId);
```

### useProductOptions

Хук для получения опций продукта.

```tsx
import { useProductOptions } from "@/features/product-variants";

const { options, isLoading, isError, error } = useProductOptions(productId);
```

### useCreateVariant

Хук для создания варианта продукта.

```tsx
import { useCreateVariant } from "@/features/product-variants";

const { createVariant, isLoading, isError, error } = useCreateVariant();
```

### useUpdateVariant

Хук для обновления варианта продукта.

```tsx
import { useUpdateVariant } from "@/features/product-variants";

const { updateVariant, isLoading, isError, error } = useUpdateVariant();
```

### useDeleteVariant

Хук для удаления варианта продукта.

```tsx
import { useDeleteVariant } from "@/features/product-variants";

const { deleteVariant, isLoading, isError, error } = useDeleteVariant();
```

### useGenerateVariants

Хук для генерации вариантов продукта.

```tsx
import { useGenerateVariants } from "@/features/product-variants";

const { generateVariants, isLoading, isError, error } = useGenerateVariants();
```

## Утилиты

### variant-utils

Утилиты для работы с вариантами продуктов.

```tsx
import { 
  formatPrice, 
  hasDiscount, 
  getCurrentPrice, 
  getDiscountPercentage,
  isInStock,
  getAttributesString,
  filterVariantsByStock,
  sortVariantsByPrice,
  groupVariantsByAttributes,
  isColorOption,
  getOptionValueColor,
  validateVariantData
} from "@/features/product-variants";

const formattedPrice = formatPrice(1000);
const hasSale = hasDiscount(variant);
const currentPrice = getCurrentPrice(variant);
const discountPercent = getDiscountPercentage(variant);
const inStock = isInStock(variant);
const attributesString = getAttributesString(variant);
```

## Страницы

### ProductVariantsPage

Страничный компонент с Suspense для управления вариантами продуктов.

```tsx
import { ProductVariantsPage } from "@/features/product-variants";

<ProductVariantsPage productId={productId} />
```

## Zod Схемы

### Локальные схемы (в types/index.ts)

#### productVariantSchema

Схема для валидации варианта продукта:

```tsx
const productVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string().nullable(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  isDefault: z.boolean(),
  stock: z.number().nullable(),
  minStock: z.number().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  price: z.number().nullable(),
  salePrice: z.number().nullable(),
  costPrice: z.number().nullable(),
  weight: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  depth: z.number().nullable(),
  attributes: z.array(z.object({
    option: z.string(),
    value: z.string(),
  })),
});
```

#### variantEditSchema

Схема для валидации редактирования варианта:

```tsx
const variantEditSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});
```

#### optionEditSchema

Схема для валидации редактирования опции:

```tsx
const optionEditSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
});
```

#### optionValueSchema

Схема для валидации значения опции:

```tsx
const optionValueSchema = z.object({
  value: z.string().min(1, "Значение обязательно"),
  hex: z.string().optional(),
});
```

#### bulkPriceEditSchema

Схема для валидации массового редактирования цен:

```tsx
const bulkPriceEditSchema = z.object({
  price: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
});
```

#### bulkStockEditSchema

Схема для валидации массового редактирования наличия:

```tsx
const bulkStockEditSchema = z.object({
  stock: z.number().int().min(0),
});
```

#### generateVariantsSchema

Схема для валидации генерации вариантов:

```tsx
const generateVariantsSchema = z.object({
  productId: z.string(),
  optionIds: z.array(z.string()),
});
```

## Типы

Все типы выводятся из Zod схем:

```tsx
// Типы из локальных схем
export type ProductAttribute = z.infer<typeof productAttributeSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type VariantEditData = z.infer<typeof variantEditSchema>;
export type OptionEditData = z.infer<typeof optionEditSchema>;
export type OptionValueData = z.infer<typeof optionValueSchema>;
export type BulkPriceEditData = z.infer<typeof bulkPriceEditSchema>;
export type BulkStockEditData = z.infer<typeof bulkStockEditSchema>;
export type GenerateVariantsData = z.infer<typeof generateVariantsSchema>;
```

## Использование

### Импорт компонентов

```tsx
import { 
  VariantsListSection,
  VariantEditDialog,
  OptionsDialog,
  BulkPriceEdit,
  GenerateVariantsDialog
} from "@/features/product-variants";
```

### Импорт хуков

```tsx
import { 
  useProductVariants,
  useProductOptions,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
  useGenerateVariants
} from "@/features/product-variants";
```

### Импорт утилит

```tsx
import { 
  formatPrice,
  hasDiscount,
  getCurrentPrice,
  getDiscountPercentage,
  isInStock,
  getAttributesString
} from "@/features/product-variants";
```

### Импорт типов

```tsx
import { 
  ProductVariant,
  ProductAttribute,
  VariantEditData,
  OptionEditData,
  OptionValueData
} from "@/features/product-variants";
```

## Соответствие правилам проекта

✅ **UI компоненты из @qco/ui** - все импорты корректные  
✅ **Формы с react-hook-form + zodResolver** - используется в VariantEditDialog, OptionsDialog, OptionEditDialog  
✅ **Skeleton-компоненты** - есть VariantsListSkeleton  
✅ **Структура features** - есть components, hooks, utils, types, pages  
✅ **Абсолютные пути** - используются @/ и @qco/ui  
✅ **Клиентские компоненты** - "use client" только где нужен интерактив  
✅ **Типы из Zod схем** - все типы выводятся из Zod схем  
✅ **Нет дублирующих типов** - все типы из Zod схем  
✅ **Серверные страницы** - есть ProductVariantsPage с Suspense  

## Особенности

- **Массовое редактирование**: компоненты для массового изменения цен и наличия
- **Умная генерация**: автоматическое создание вариантов на основе опций
- **Excel-подобный интерфейс**: редактирование вариантов в табличном виде
- **Цветовые опции**: поддержка цветовых значений с визуальным отображением
- **Валидация данных**: все формы используют Zod схемы для валидации
- **Оптимизированные запросы**: хуки для эффективной работы с данными
- **Типобезопасность**: все типы выводятся из Zod схем
- **Доступность**: использование компонентов shadcn/ui для accessibility
- **Консистентность**: единообразная структура всех компонентов
- **Централизованные схемы**: все схемы определены в types/index.ts 