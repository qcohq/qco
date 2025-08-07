# CategoriesSection Component

Компонент для отображения категорий товаров с поддержкой иерархии.

## Описание

`CategoriesSection` - это React компонент, который отображает сетку категорий товаров. Компонент может работать в двух режимах:

1. **Корневые категории** - отображает категории первого уровня (без родительской категории)
2. **Подкатегории** - отображает дочерние категории для указанной родительской категории

## Props

```typescript
interface CategoriesSectionProps {
  categorySlug?: string; // Slug родительской категории (опционально)
}
```

### categorySlug
- **Тип**: `string | undefined`
- **Описание**: Slug родительской категории. Если не указан, отображаются корневые категории. Если указан, отображаются дочерние категории для этой родительской категории.

## Использование

### Отображение корневых категорий
```tsx
import CategoriesSection from "@/components/categories-section";

function HomePage() {
  return (
    <div>
      <CategoriesSection />
    </div>
  );
}
```

### Отображение подкатегорий
```tsx
import CategoriesSection from "@/components/categories-section";

function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <CategoriesSection categorySlug={params.slug} />
    </div>
  );
}
```

## API

Компонент использует следующие tRPC роутеры:

- `categories.getRoot` - для получения корневых категорий
- `categories.getChildrenByParentSlug` - для получения дочерних категорий по slug родителя

## Структура данных

Компонент ожидает данные в следующем формате:

```typescript
type Category = {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  } | null;
  // ... другие поля
};
```

## Стилизация

Компонент использует Tailwind CSS для стилизации:

- Сетка: `grid grid-cols-3 md:grid-cols-6 gap-4`
- Соотношение сторон карточек: `aspect-[3/2]`
- Hover эффекты: масштабирование изображения и изменение прозрачности оверлея
- Адаптивность: 3 колонки на мобильных, 6 на десктопе

## Состояния

Компонент обрабатывает следующие состояния:

1. **Загрузка** - отображает скелетон с анимацией
2. **Ошибка** - отображает сообщение об ошибке
3. **Успех** - отображает сетку категорий

## Примеры

### Главная страница (корневые категории)
```tsx
// apps/web/src/app/page.tsx
import CategoriesSection from "@/components/categories-section";

export default function HomePage() {
  return (
    <main>
      <CategoriesSection />
    </main>
  );
}
```

### Страница категории (подкатегории)
```tsx
// apps/web/src/app/catalog/[slug]/page.tsx
import CategoriesSection from "@/components/categories-section";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <CategoriesSection categorySlug={params.slug} />
    </main>
  );
}
```

## Тестирование

Для тестирования компонента создана страница `/test-categories`, которая демонстрирует все варианты использования:

- Корневые категории
- Подкатегории для "women"
- Подкатегории для "men"

## Зависимости

- `@tanstack/react-query` - для управления состоянием запросов
- `@qco/web-api` - для типов данных
- `@qco/trpc/react` - для tRPC клиента
- `next/image` - для оптимизированных изображений
- `next/link` - для навигации 