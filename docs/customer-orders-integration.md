# Интеграция заказов клиента

Данная документация описывает интеграцию заказов клиента с API согласно правилам CONTRIBUTING.MD.

## Обзор

Система заказов клиента состоит из следующих компонентов:

- **API Layer**: tRPC роуты для получения заказов клиента
- **Validation Layer**: Zod схемы для валидации входных и выходных данных
- **Frontend Components**: React компоненты для отображения заказов
- **Hooks**: React хуки для работы с API

## Структура API

### Валидаторы (`packages/validators/src/orders.ts`)

```typescript
// Входные данные для получения заказов клиента
export const customerOrdersInputSchema = z.object({
  customerId: z.string(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  status: z.enum(Object.values(OrderStatus) as [string, ...string[]]).optional(),
  sortBy: z.enum(['createdAt', 'totalAmount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Выходные данные
export const customerOrdersOutputSchema = z.object({
  orders: z.array(orderSchema),
  total: z.number(),
  hasMore: z.boolean(),
});
```

### API Роут (`packages/api/src/router/orders/get-by-customer.ts`)

```typescript
export const getByCustomer = protectedProcedure
  .input(customerOrdersInputSchema)
  .output(customerOrdersOutputSchema)
  .query(async ({ ctx, input }) => {
    // Реализация с фильтрацией, сортировкой и пагинацией
  });
```

## Frontend Компоненты

### Хуки

#### `useCustomerOrders` (`apps/app/src/features/customers/hooks/use-customer-orders.ts`)

Основной хук для работы с заказами клиента:

```typescript
export function useCustomerOrders(
  customerId: string, 
  filters?: Omit<CustomerOrdersInput, 'customerId'>
) {
  // Возвращает orders, total, hasMore, isLoading, error, refetch
}
```

### Компоненты

#### `CustomerOrdersSection` (`apps/app/src/features/customers/components/customer-orders-section.tsx`)

Основной компонент для отображения заказов клиента с:
- Фильтрацией по статусу
- Сортировкой по дате, сумме, статусу
- Пагинацией
- Статистикой

#### `CustomerOrdersTable` (`apps/app/src/features/customers/components/customer-orders-table.tsx`)

Таблица заказов для десктопной версии с:
- Номером заказа
- Датой создания
- Статусом (с переводом на русский)
- Суммой заказа
- Количеством товаров
- Действиями (просмотр, изменение статуса и т.д.)

#### `CustomerOrdersMobileList` (`apps/app/src/features/customers/components/customer-orders-mobile-list.tsx`)

Мобильный список заказов с адаптивным дизайном.

#### `CustomerOrdersFilters` (`apps/app/src/features/customers/components/customer-orders-filters.tsx`)

Компонент фильтрации с:
- Поиском по заказам
- Фильтром по статусу
- Сортировкой
- Настройкой количества элементов на странице

#### `CustomerOrdersPagination` (`apps/app/src/features/customers/components/customer-orders-pagination.tsx`)

Компонент пагинации с навигацией по страницам.

#### `CustomerOrdersStats` (`apps/app/src/features/customers/components/customer-orders-stats.tsx`)

Компонент статистики с:
- Общим количеством заказов
- Общей суммой заказов
- Средним чеком
- Датой последнего заказа

## Использование

### В компоненте клиента

```typescript
import { CustomerOrdersSection } from "@/features/customers/components/customer-orders-section";

export function CustomerDetailPage({ customerId }: { customerId: string }) {
  return (
    <div>
      <CustomerOrdersSection customerId={customerId} />
    </div>
  );
}
```

### Прямое использование хука

```typescript
import { useCustomerOrders } from "@/features/customers/hooks/use-customer-orders";

export function CustomOrdersComponent({ customerId }: { customerId: string }) {
  const { orders, total, hasMore, isLoading, error } = useCustomerOrders(
    customerId,
    {
      limit: 10,
      status: 'delivered',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  );

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>{order.orderNumber}</div>
      ))}
    </div>
  );
}
```

## Особенности реализации

### Типобезопасность

Все компоненты используют типы из `@qco/validators`, что обеспечивает:
- Единообразие типов между фронтендом и бэкендом
- Автоматическую валидацию данных
- IntelliSense в IDE

### Производительность

- Кэширование запросов с помощью React Query
- Пагинация для больших списков
- Оптимистичные обновления
- Ленивая загрузка данных

### Адаптивность

- Отдельные компоненты для мобильной и десктопной версий
- Responsive дизайн с Tailwind CSS
- Оптимизация для различных размеров экрана

### Доступность

- ARIA атрибуты
- Поддержка клавиатурной навигации
- Screen reader friendly

## Расширение функциональности

### Добавление новых фильтров

1. Обновите `customerOrdersInputSchema` в валидаторах
2. Добавьте логику фильтрации в API роут
3. Обновите компонент `CustomerOrdersFilters`
4. Добавьте новые опции в хук `useCustomerOrders`

### Добавление новых действий

1. Создайте новый API роут для действия
2. Добавьте валидаторы для входных данных
3. Создайте хук для мутации
4. Обновите компоненты с действиями

### Кастомизация отображения

Все компоненты принимают дополнительные пропсы для кастомизации:
- CSS классы
- Обработчики событий
- Конфигурация отображения

## Тестирование

### Unit тесты

```typescript
import { render, screen } from '@testing-library/react';
import { CustomerOrdersTable } from './customer-orders-table';

describe('CustomerOrdersTable', () => {
  it('отображает заказы корректно', () => {
    const mockOrders = [/* mock data */];
    render(<CustomerOrdersTable orders={mockOrders} />);
    
    expect(screen.getByText('Номер заказа')).toBeInTheDocument();
  });
});
```

### Integration тесты

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { CustomerOrdersSection } from './customer-orders-section';

describe('CustomerOrdersSection', () => {
  it('загружает и отображает заказы клиента', async () => {
    render(<CustomerOrdersSection customerId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('История заказов')).toBeInTheDocument();
    });
  });
});
```

## Заключение

Интеграция заказов клиента следует всем принципам CONTRIBUTING.MD:

- ✅ Модульная архитектура
- ✅ Типобезопасность с Zod
- ✅ Маленькие, сфокусированные компоненты
- ✅ Переиспользуемые хуки
- ✅ Единообразная структура API
- ✅ Адаптивный дизайн
- ✅ Доступность
- ✅ Производительность 