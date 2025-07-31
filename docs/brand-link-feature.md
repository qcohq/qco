# Ссылки на бренды в продуктах

## Описание

Добавлена функциональность для отображения ссылок на бренды в карточках продуктов. Теперь название бренда в деталях продукта является кликабельной ссылкой, которая ведет на страницу бренда.

## Изменения в API

### Web API (`packages/web-api/src/router/products/get-by-slug.ts`)

Добавлено поле `brandSlug` в ответ API:

```typescript
return {
  // ... другие поля
  brand: product.brand?.name || null,
  brandSlug: product.brand?.slug || null, // Новое поле
  // ... остальные поля
};
```

### Валидаторы (`packages/web-validators/src/product-detail.ts`)

Обновлена схема `productDetailSchema`:

```typescript
export const productDetailSchema = z.object({
  // ... другие поля
  brand: z.string().nullable(),
  brandSlug: z.string().nullable(), // Новое поле
  // ... остальные поля
});
```

## Изменения во фронтенде

### Типы (`apps/web/src/features/products/types/product.ts`)

Добавлено поле `brandSlug` в интерфейс `Product`:

```typescript
export interface Product {
  // ... другие поля
  brand: string | null;
  brandSlug: string | null; // Новое поле
  // ... остальные поля
}
```

### Хук (`apps/web/src/features/products/hooks/use-product-by-slug.ts`)

Обновлен хук для обработки `brandSlug`:

```typescript
const product: Product | undefined = data
  ? {
      // ... другие поля
      brand: (data as any).brand || null,
      brandSlug: (data as any).brandSlug || null, // Новое поле
      // ... остальные поля
    }
  : undefined;
```

### Компоненты

#### BrandLink (`apps/web/src/features/products/components/brand-link.tsx`)

Создан новый компонент для отображения ссылки на бренд:

```typescript
interface BrandLinkProps {
  brandName: string | null;
  brandSlug: string | null;
  className?: string;
}

export function BrandLink({ brandName, brandSlug, className = "" }: BrandLinkProps) {
  if (!brandName) {
    return null;
  }

  if (brandSlug) {
    return (
      <Link 
        href={`/brands/${brandSlug}`}
        className={`hover:text-foreground transition-colors ${className}`}
      >
        {brandName}
      </Link>
    );
  }

  return <span className={className}>{brandName}</span>;
}
```

#### ProductDetail (`apps/web/src/features/products/components/product-detail.tsx`)

Обновлен компонент для использования `BrandLink`:

```typescript
<div>
  <p className="text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
    <BrandLink 
      brandName={product.brand}
      brandSlug={product.brandSlug}
    />
  </p>
  <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
    {product.name}
  </h1>
</div>
```

## Использование

Теперь в деталях продукта название бренда отображается как ссылка, если у продукта есть связанный бренд с slug. При клике пользователь переходит на страницу бренда `/brands/{brandSlug}`.

Если у продукта нет бренда или slug бренда, название отображается как обычный текст.

## Тестирование

Создан тест для проверки API (`packages/web-api/test/products/get-by-slug.test.ts`).

## Совместимость

Изменения обратно совместимы - если у продукта нет бренда или slug, функциональность работает корректно без ошибок. 