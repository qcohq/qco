# Интеграция блога с tRPC API

Этот модуль содержит компоненты для работы с блогом через tRPC API.

## Компоненты

### BlogList
Компонент для отображения списка постов блога с пагинацией.

**Использование:**
```tsx
import { BlogList } from "@/features/blog";

export default function BlogPage() {
  return <BlogList />;
}
```

### BlogPostLoader
Компонент для загрузки и отображения отдельного поста блога.

**Использование:**
```tsx
import { BlogPostLoader } from "@/features/blog";

export default function BlogPostPage({ slug }: { slug: string }) {
  return <BlogPostLoader slug={slug} />;
}
```

## API Endpoints

Используются следующие tRPC роутеры:

- `trpc.blog.getPublished` - получение списка опубликованных постов
- `trpc.blog.getBySlug` - получение поста по slug
- `trpc.blog.getFeatured` - получение избранных постов

## Типы данных

Все типы определены в `@/types/blog`:

- `BlogPost` - основная структура поста
- `BlogPostListResponse` - ответ API для списка постов
- `BlogPostFilters` - параметры фильтрации

## Особенности

- Автоматическая пагинация
- Обработка состояний загрузки и ошибок
- Поддержка метаданных (просмотры, лайки, комментарии)
- Форматирование дат с локализацией
- Адаптивный дизайн 