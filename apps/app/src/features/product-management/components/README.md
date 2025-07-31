# BrandCombobox Components

Этот модуль содержит компоненты для выбора брендов с использованием shadcn/ui Combobox.

## Компоненты

### BrandCombobox

Базовый компонент для выбора брендов с поддержкой поиска и автодополнения.

```tsx
import { BrandCombobox } from "./brand-combobox";

<BrandCombobox
  value={selectedBrandId}
  onValueChange={setSelectedBrandId}
  placeholder="Выберите бренд..."
  disabled={false}
/>
```

**Props:**
- `value?: string` - ID выбранного бренда
- `onValueChange?: (value: string) => void` - Callback при изменении выбора
- `placeholder?: string` - Placeholder текст
- `className?: string` - Дополнительные CSS классы
- `disabled?: boolean` - Отключить компонент

### BrandComboboxForm

Компонент для использования с React Hook Form, который автоматически интегрируется с формой.

```tsx
import { BrandComboboxForm } from "./brand-combobox-form";

<BrandComboboxForm
  name="brandId"
  label="Бренд"
  description="Выберите бренд товара"
  placeholder="Выберите бренд..."
/>
```

**Props:**
- `name: string` - Имя поля в форме
- `label?: string` - Лейбл поля
- `description?: string` - Описание поля
- `placeholder?: string` - Placeholder текст
- `className?: string` - Дополнительные CSS классы
- `disabled?: boolean` - Отключить компонент

## Особенности

1. **Поиск с debounce** - Поиск автоматически выполняется с задержкой 300ms
2. **Lazy loading** - Данные загружаются только при открытии компонента
3. **Кэширование** - Использует React Query для кэширования результатов
4. **Обработка ошибок** - Показывает сообщения об ошибках загрузки
5. **Доступность** - Полная поддержка ARIA атрибутов
6. **Типизация** - Полная TypeScript поддержка

## API

Компоненты используют tRPC процедуру `brands.getBrandsForSelect` для получения данных:

```typescript
// Параметры запроса
{
  search?: string;        // Поисковый запрос
  limit?: number;         // Лимит результатов (по умолчанию 50)
  defaultBrandId?: string; // ID бренда для предзагрузки
}

// Ответ
{
  data: Array<{
    id: string;
    name: string;
    slug: string;
    // ... другие поля бренда
  }>;
  pagination: {
    hasMore: boolean;
    total: number;
  };
}
```

## Использование в формах

Для использования с React Hook Form:

```tsx
import { useForm } from "react-hook-form";
import { BrandComboboxForm } from "./brand-combobox-form";

function MyForm() {
  const form = useForm({
    defaultValues: {
      brandId: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <BrandComboboxForm
          name="brandId"
          label="Бренд"
          description="Выберите бренд товара"
        />
        <Button type="submit">Отправить</Button>
      </form>
    </Form>
  );
}
```

## Замена TRPCSearchableSelect

Эти компоненты заменяют устаревший `TRPCSearchableSelect` и предоставляют:

- ✅ Лучшую производительность
- ✅ Более простой API
- ✅ Лучшую типизацию
- ✅ Соответствие дизайн-системе shadcn/ui
- ✅ Лучшую доступность 