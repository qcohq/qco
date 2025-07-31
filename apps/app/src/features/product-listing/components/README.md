# Product Listing Components

## Skeleton Components

Этот модуль содержит набор скелетонов для отображения состояния загрузки на странице продуктов.

### Основные скелетоны

#### `ProductsPageSkeleton`
Полный скелетон для всей страницы продуктов, включающий:
- Заголовок с кнопками действий
- Фильтры
- Табы для переключения видов
- Таблицу с данными
- Пагинацию

```tsx
import { ProductsPageSkeleton } from "./products-page-skeleton";

// Использование
{isLoading ? <ProductsPageSkeleton /> : <ProductsPageContent />}
```

#### `ProductTableSkeleton`
Скелетон только для таблицы продуктов.

#### `ProductGridSkeleton`
Скелетон для отображения продуктов в виде карточек (плиточный вид).

#### `CompactProductListSkeleton`
Скелетон для компактного списка продуктов.

#### `ProductFiltersSkeleton`
Скелетон для блока фильтров.

#### `PaginationSkeleton`
Скелетон для пагинации.

### Улучшенные скелетоны

#### `EnhancedSkeleton`
Базовый компонент скелетона с различными вариантами анимации:

```tsx
import { EnhancedSkeleton } from "./enhanced-skeleton";

// Варианты
<EnhancedSkeleton variant="default" animation="pulse" />
<EnhancedSkeleton variant="text" animation="shimmer" />
<EnhancedSkeleton variant="circular" animation="wave" />
<EnhancedSkeleton variant="rectangular" animation="pulse" />
```

#### Специализированные скелетоны

- `TextSkeleton` - для текстовых элементов
- `AvatarSkeleton` - для аватаров и изображений
- `ImageSkeleton` - для больших изображений
- `ButtonSkeleton` - для кнопок

### Анимации

Доступны три типа анимации:

1. **pulse** - стандартная пульсация (по умолчанию)
2. **shimmer** - эффект мерцания с градиентом
3. **wave** - волновая анимация

### Использование

```tsx
import { 
  ProductsPageSkeleton,
  ProductTableSkeleton,
  TextSkeleton,
  AvatarSkeleton 
} from "@/features/product-listing/components";

// В компоненте
export function ProductsPage() {
  const { data, isLoading } = useProductsList();
  
  if (isLoading) {
    return <ProductsPageSkeleton />;
  }
  
  return <ProductsPageContent data={data} />;
}
```

### Кастомизация

Все скелетоны поддерживают стандартные пропсы React и могут быть кастомизированы через className:

```tsx
<ProductsPageSkeleton className="my-custom-class" />
<TextSkeleton className="h-6 w-32" />
<AvatarSkeleton className="h-16 w-16" />
```

### CSS Анимации

Анимации определены в `apps/app/src/app/globals.css`:

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes wave {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}
``` 