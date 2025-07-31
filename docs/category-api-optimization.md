# Оптимизация API category.list

## Проблема

API `category.list` вызывается множество раз из-за следующих причин:

1. **Компонент `Header` рендерится на каждой странице** (в `layout.tsx`)
2. **`CategoryDropdown` внутри `Header` использует `useSubcategories` для каждой категории с `hasDropdown: true`**
3. **Каждый вызов `useSubcategories` делает отдельный запрос `category.list`**

## Примененные решения

### 1. Увеличение времени кэширования

```typescript
// Увеличили staleTime с 5 до 10 минут
staleTime: 10 * 60 * 1000, // 10 minutes
gcTime: 15 * 60 * 1000, // 15 minutes
```

### 2. Отключение ненужных refetch

```typescript
refetchOnWindowFocus: false, // Отключаем refetch при фокусе окна
refetchOnMount: false, // Отключаем refetch при монтировании, если данные уже есть
```

### 3. Условная загрузка подкатегорий

```typescript
// Загружаем подкатегории только когда меню открыто
const { data: subcategories, isLoading } = useSubcategories(
  isOpen ? categoryId : ""
);

// Используем enabled для предотвращения запроса при пустом parentId
enabled: !!parentId, // Запрос выполняется только если parentId не пустой
```

### 4. Мемоизация компонентов

```typescript
// Мемоизируем компоненты для предотвращения лишних рендеров
const CategoryWithDropdown = memo(function CategoryWithDropdown({...}) {
  // ...
});

export const CategoryDropdown = memo(function CategoryDropdown() {
  // ...
});
```

### 5. Оптимизация обработки событий мыши

```typescript
const handleMouseEnter = () => {
  // Очищаем предыдущий таймер
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  setIsOpen(true);
};

const handleMouseLeave = () => {
  // Небольшая задержка перед закрытием
  timeoutRef.current = setTimeout(() => {
    setIsOpen(false);
  }, 100);
};
```

### 6. Очистка таймеров

```typescript
// Очищаем таймер при размонтировании
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### 7. Исправление ошибки с хуками

**Проблема:** "Rendered more hooks than during the previous render"

**Решение:** Всегда вызывать `useQuery`, но использовать опцию `enabled` для контроля выполнения запроса:

```typescript
export function useSubcategories(parentId: string) {
  const trpc = useTRPC();
  
  const queryOptions = trpc.category.list.queryOptions(
    z.object({
      parentId: z.string().optional()
    }).parse({
      parentId,
    }),
    {
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!parentId, // Ключевое исправление
    },
  );

  return useQuery(queryOptions);
}
```

## Результат

После применения этих оптимизаций:

- ✅ **Уменьшено количество запросов** - подкатегории загружаются только при наведении
- ✅ **Улучшено кэширование** - данные кэшируются на 10 минут
- ✅ **Оптимизирован UX** - плавное открытие/закрытие меню
- ✅ **Предотвращены утечки памяти** - очистка таймеров
- ✅ **Улучшена производительность** - мемоизация компонентов
- ✅ **Исправлена ошибка с хуками** - соблюдение правил React Hooks

## Дополнительные рекомендации

### 1. Мониторинг запросов

Добавьте логирование для отслеживания количества запросов:

```typescript
// В хуке useSubcategories
console.log(`Loading subcategories for parentId: ${parentId}`);
```

### 2. Prefetching

Рассмотрите возможность prefetching подкатегорий при загрузке страницы:

```typescript
// В CategoryDropdown
useEffect(() => {
  if (dynamicCategories) {
    // Prefetch подкатегории для основных категорий
    dynamicCategories.forEach(category => {
      queryClient.prefetchQuery(
        trpc.category.list.queryOptions({ parentId: category.id })
      );
    });
  }
}, [dynamicCategories, queryClient]);
```

### 3. Виртуализация для больших списков

Если категорий становится много, рассмотрите виртуализацию:

```typescript
import { FixedSizeList as List } from 'react-window';

// Виртуализированный список категорий
```

### 4. Server-Side Rendering

Для критически важных категорий рассмотрите SSR:

```typescript
// В getServerSideProps или generateStaticProps
const categories = await trpc.category.list.query({ parentId: null });
```

## Мониторинг

Для отслеживания эффективности оптимизаций:

1. **Network tab** - проверьте количество запросов к `category.list`
2. **React DevTools** - отслеживайте ре-рендеры компонентов
3. **Performance tab** - измерьте время загрузки страниц
4. **Lighthouse** - проверьте общую производительность

## Важные замечания

### Правила React Hooks

При оптимизации хуков важно соблюдать правила:

1. **Хуки всегда вызываются в одном порядке** - нельзя условно вызывать хуки
2. **Используйте опцию `enabled`** вместо условного возврата из хука
3. **Мемоизируйте компоненты** для предотвращения лишних рендеров
4. **Очищайте ресурсы** в `useEffect` cleanup функциях 