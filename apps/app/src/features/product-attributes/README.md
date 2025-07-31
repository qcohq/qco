# Product Attributes Feature

Модуль для управления атрибутами типов продуктов с использованием Zod схем для валидации.

## Компоненты

### AttributeForm

Форма для создания и редактирования атрибутов типа продукта с валидацией через Zod.

```tsx
import { AttributeForm } from "@/features/product-attributes";

<AttributeForm 
  productTypeId="product-type-id"
  initialData={attributeData} // для редактирования
  onSuccess={() => console.log("Success")}
  onCancel={() => console.log("Cancelled")}
/>
```

**Props:**
- `productTypeId: string` - ID типа продукта
- `initialData?: Partial<FormValues>` - данные для редактирования (опционально)
- `onSuccess?: () => void` - функция при успешном сохранении
- `onCancel?: () => void` - функция при отмене

### AttributesList

Компонент для отображения списка атрибутов с фильтрацией, сортировкой и действиями.

```tsx
import { AttributesList } from "@/features/product-attributes";

<AttributesList productTypeId="product-type-id" />
```

**Props:**
- `productTypeId: string` - ID типа продукта

### AttributesPage

Страница для отображения атрибутов типа продукта.

```tsx
import { AttributesPage } from "@/features/product-attributes";

<AttributesPage productTypeId="product-type-id" />
```

**Props:**
- `productTypeId: string` - ID типа продукта

### CreateAttributePage

Страница для создания нового атрибута.

```tsx
import { CreateAttributePage } from "@/features/product-attributes";

<CreateAttributePage productTypeId="product-type-id" />
```

**Props:**
- `productTypeId: string` - ID типа продукта

## Zod Схемы

### createProductTypeAttributeSchema

Схема для создания атрибута типа продукта:

```tsx
const createProductTypeAttributeSchema = z.object({
  name: z.string()
    .min(2, "Название атрибута должно содержать минимум 2 символа")
    .max(100, "Название атрибута не может быть длиннее 100 символов")
    .trim(),
  slug: z.string()
    .min(1, "Slug обязателен")
    .max(100, "Slug не может быть длиннее 100 символов")
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефисы")
    .trim(),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"], {
    error: "Выберите корректный тип атрибута",
  }),
  options: z.array(z.string().min(1).max(50).trim())
    .default([])
    .optional(),
  isFilterable: z.boolean().default(false),
  isRequired: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true).optional(),
  productTypeId: z.string().min(1, "Необходимо указать тип продукта"),
})
.transform((data) => {
  // Для типов, которые не используют опции, очищаем поле options
  if (data.type !== "select" && data.type !== "multiselect") {
    return { ...data, options: [] };
  }
  return data;
})
.refine((data) => {
  // Проверяем, что для select и multiselect есть минимум 2 опции
  if ((data.type === "select" || data.type === "multiselect") && 
      (!data.options || data.options.length < 2)) {
    return false;
  }
  return true;
}, {
  error: "Для типов 'Выбор из списка' и 'Множественный выбор' необходимо минимум 2 опции",
  path: ["options"],
});
```

### updateProductTypeAttributeSchema

Схема для обновления атрибута типа продукта:

```tsx
const updateProductTypeAttributeSchema = z.object({
  name: z.string()
    .min(2, "Название атрибута должно содержать минимум 2 символа")
    .max(100, "Название атрибута не может быть длиннее 100 символов")
    .trim()
    .optional(),
  slug: z.string()
    .min(1, "Slug обязателен")
    .max(100, "Slug не может быть длиннее 100 символов")
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефисы")
    .trim()
    .optional(),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"], {
    error: "Выберите корректный тип атрибута",
  }).optional(),
  options: z.array(z.string().min(1).max(50).trim())
    .default([])
    .optional(),
  isFilterable: z.boolean().default(false).optional(),
  isRequired: z.boolean().default(false).optional(),
  sortOrder: z.number().int().min(0).default(0).optional(),
  isActive: z.boolean().default(true).optional(),
  productTypeId: z.string().min(1, "Необходимо указать тип продукта").optional(),
  id: z.string().min(1, "Идентификатор атрибута обязателен"),
})
.transform((data) => {
  // Для типов, которые не используют опции, очищаем поле options
  if (data.type && data.type !== "select" && data.type !== "multiselect") {
    return { ...data, options: [] };
  }
  return data;
})
.refine((data) => {
  // Проверяем, что для select и multiselect есть минимум 2 опции
  if (data.type && (data.type === "select" || data.type === "multiselect") && 
      (!data.options || data.options.length < 2)) {
    return false;
  }
  return true;
}, {
  error: "Для типов 'Выбор из списка' и 'Множественный выбор' необходимо минимум 2 опции",
  path: ["options"],
});
```

### productTypeAttributeSchema

Схема для атрибута типа продукта (ответ API):

```tsx
const productTypeAttributeSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Название атрибута должно содержать минимум 2 символа"),
  slug: z.string().min(1, "Slug обязателен"),
  type: z.string(), // API возвращает string, не enum
  isRequired: z.boolean().default(false),
  isFilterable: z.boolean().default(false),
  options: z.array(z.string()).default([]).optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  productTypeId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
```

## Типы

Все типы выведены из Zod схем для обеспечения типобезопасности:

```tsx
export type ProductTypeAttribute = z.infer<typeof productTypeAttributeSchema>;
export type CreateProductTypeAttribute = z.infer<typeof createProductTypeAttributeSchema>;
export type UpdateProductTypeAttribute = z.infer<typeof updateProductTypeAttributeSchema>;
```

## API Роуты

### productTypeAttributes

- `create` - создание атрибута
- `update` - обновление атрибута
- `delete` - удаление атрибута
- `getById` - получение атрибута по ID
- `getByProductType` - получение атрибутов по типу продукта
- `getAll` - получение всех атрибутов
- `toggleActive` - переключение активности атрибута

## Использование

### Импорт компонентов

```tsx
import { 
  AttributeForm, 
  AttributesList, 
  AttributesPage,
  CreateAttributePage 
} from "@/features/product-attributes";
```

### Импорт типов

```tsx
import { 
  ProductTypeAttribute,
  CreateProductTypeAttribute,
  UpdateProductTypeAttribute 
} from "@/features/product-attributes";
```

## Валидация

Все компоненты используют Zod схемы для валидации:

1. **AttributeForm** - валидирует данные формы с помощью React Hook Form
2. **AttributesList** - использует валидированные данные из API
3. **API роуты** - валидируют входные данные с помощью Zod схем

## Особенности

- **Автоматическая генерация slug** - slug генерируется автоматически из названия
- **Валидация опций** - для типов select/multiselect требуется минимум 2 опции
- **Очистка опций** - для типов, которые не используют опции, поле options очищается
- **Типобезопасность** - все типы выведены из Zod схем
- **Обработка ошибок** - graceful handling ошибок валидации и API
- **Кэширование** - автоматическая инвалидация кэша при изменениях 