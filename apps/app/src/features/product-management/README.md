# Product Management Feature

Модуль для создания, редактирования и управления продуктами с использованием форм React Hook Form и Zod валидации.

## Структура модуля

```
product-management/
├── components/          # UI компоненты
│   ├── brand-combobox.tsx
│   ├── brand-combobox-form.tsx
│   ├── duplicate-product-button.tsx
│   ├── error-boundary.tsx
│   ├── loading-skeleton.tsx
│   ├── product-create-form.tsx
│   ├── product-create-form-basic-info.tsx
│   ├── product-edit-form-basic-info.tsx
│   ├── product-edit-form-categories.tsx
│   ├── product-edit-form-container.tsx
│   ├── product-edit-form-error.tsx
│   ├── product-edit-form-header.tsx
│   ├── product-edit-form-images.tsx
│   ├── product-edit-form-loading.tsx
│   ├── product-edit-form-preview-sidebar.tsx
│   ├── product-edit-form-pricing.tsx
│   ├── product-edit-form-product-type-attributes.tsx
│   ├── product-edit-form-seo.tsx
│   ├── product-edit-form-settings.tsx
│   ├── product-edit-form-specifications.tsx
│   ├── product-type-select.tsx
│   ├── product-update-form.tsx
│   └── types.ts
├── hooks/              # Хуки для работы с данными
│   ├── use-duplicate-product.ts
│   ├── use-form-field.ts
│   ├── use-loading-states.ts
│   ├── use-optimized-queries.ts
│   ├── use-product-mutations.ts
│   ├── use-product-types-optimized.ts
│   └── use-slug-validation.ts
├── utils/              # Утилиты
│   └── form-utils.ts
├── pages/              # Страничные компоненты
│   └── product-management-page.tsx
├── types/              # Типы и схемы
│   └── index.ts
└── index.ts            # Экспорты модуля
```

## Основные компоненты

### ProductCreateForm

Форма для создания нового продукта с валидацией через Zod.

```tsx
import { ProductCreateForm } from "@/features/product-management";

<ProductCreateForm />
```

### ProductUpdateForm

Форма для редактирования существующего продукта.

```tsx
import { ProductUpdateForm } from "@/features/product-management";

<ProductUpdateForm
  productId={productId}
  initialProductData={productData}
  initialCategories={categories}
  brands={brands}
/>
```

### ProductEditFormContainer

Контейнер для загрузки данных продукта и отображения формы редактирования.

```tsx
import { ProductEditFormContainer } from "@/features/product-management";

<ProductEditFormContainer productId={productId} />
```

### BrandComboboxForm

Компонент для выбора бренда в формах с интеграцией React Hook Form.

```tsx
import { BrandComboboxForm } from "@/features/product-management";

<BrandComboboxForm
  name="brandId"
  label="Бренд"
  description="Выберите бренд товара"
  placeholder="Выберите бренд..."
/>
```

## Хуки

### useProductMutations

Хук для мутаций продуктов (создание, обновление, удаление, дублирование).

```tsx
import { useProductMutations } from "@/features/product-management";

const { createProduct, updateProduct, deleteProduct, duplicateProduct } = useProductMutations();
```

### useSlugValidation

Хук для валидации уникальности слага продукта.

```tsx
import { useSlugValidation } from "@/features/product-management";

const slugValidation = useSlugValidation({
  slug: slugValue,
  excludeId: productId,
  enabled: !!slugValue && slugValue.length >= 2,
});
```

### useProductTypesOptimized

Хук для получения типов продуктов с оптимизацией.

```tsx
import { useProductTypesOptimized } from "@/features/product-management";

const { productTypes, isLoading } = useProductTypesOptimized();
```

## Утилиты

### form-utils

Утилиты для работы с формами продуктов.

```tsx
import { 
  validateProductForm, 
  formatPrice, 
  parsePrice,
  generateDefaultSlug 
} from "@/features/product-management";

const validation = validateProductForm(formData);
const formattedPrice = formatPrice(1000);
const parsedPrice = parsePrice("1000.50");
const slug = generateDefaultSlug("Product Name");
```

## Страницы

### ProductManagementPage

Страничный компонент с Suspense для управления продуктами.

```tsx
import { ProductManagementPage } from "@/features/product-management";

<ProductManagementPage productId={productId} />
```

## Zod Схемы

### Локальные схемы (в components/types.ts)

#### attributeSchema

Схема для валидации атрибутов продукта:

```tsx
const attributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["select", "multiple", "color", "text"]),
  options: z.array(z.string()),
  required: z.boolean().optional(),
  description: z.string().optional(),
});
```

#### variantSchema

Схема для валидации вариантов продукта:

```tsx
const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  price: z.number(),
  salePrice: z.number().optional(),
  stock: z.number(),
  attributes: z.record(z.string(), z.string()),
});
```

### Схемы из @qco/validators

#### productCreateSchema и productUpdateSchema

Схемы для валидации создания и обновления продуктов (из `@qco/validators`):

```tsx
import { productCreateSchema, productUpdateSchema } from "@qco/validators";

type ProductCreateInput = z.infer<typeof productCreateSchema>;
type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
```

## Типы

Все типы выводятся из Zod схем или импортируются из `@qco/validators`:

```tsx
// Типы из валидаторов
export type Product = ProductItem;
export type { ProductItem, ProductUpdateInput } from "@qco/validators";

// Типы из локальных схем
export type Attribute = z.infer<typeof attributeSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type AttributeTemplate = z.infer<typeof attributeTemplateSchema>;
```

## Использование

### Импорт компонентов

```tsx
import { 
  ProductCreateForm,
  ProductUpdateForm,
  ProductEditFormContainer,
  BrandComboboxForm 
} from "@/features/product-management";
```

### Импорт хуков и утилит

```tsx
import { 
  useProductMutations,
  useSlugValidation,
  useProductTypesOptimized,
  validateProductForm,
  formatPrice 
} from "@/features/product-management";
```

### Импорт типов

```tsx
import { 
  Product,
  ProductItem,
  ProductUpdateInput,
  Attribute,
  Variant 
} from "@/features/product-management";
```

## Соответствие правилам проекта

✅ **UI компоненты из @qco/ui** - все импорты корректные  
✅ **Формы с react-hook-form + zodResolver** - используется в ProductCreateForm и ProductUpdateForm  
✅ **Skeleton-компоненты** - есть ProductManagementSkeleton  
✅ **Структура features** - есть components, hooks, utils, types, pages  
✅ **Абсолютные пути** - используются @/ и @qco/ui  
✅ **Клиентские компоненты** - "use client" только где нужен интерактив  
✅ **Типы из Zod схем** - все типы выводятся из Zod схем или из @qco/validators  
✅ **Нет дублирующих типов** - все типы из Zod схем  
✅ **Серверные страницы** - есть ProductManagementPage с Suspense  

## Особенности

- **Формы с валидацией**: использование React Hook Form с Zod схемами
- **Оптимизированные запросы**: хуки для оптимизированного получения данных
- **Валидация слага**: автоматическая проверка уникальности URL
- **Управление изображениями**: drag-and-drop загрузка и сортировка
- **Атрибуты продукта**: динамическое управление характеристиками
- **Типобезопасность**: все типы выводятся из Zod схем
- **Доступность**: использование компонентов shadcn/ui для accessibility
- **Консистентность**: единообразная структура всех компонентов
- **Централизованные схемы**: формы используют схемы из @qco/validators 