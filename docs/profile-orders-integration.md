# Интеграция API для страницы заказов профиля

## Обзор

Интеграция с API для страницы `/profile/orders` включает в себя:

1. **Список заказов** - отображение истории заказов пользователя
2. **Детали заказа** - подробная информация о конкретном заказе
3. **Фильтрация по статусу** - фильтрация заказов по статусу
4. **Пагинация** - поддержка пагинации для больших списков

## Структура API

### Основные эндпоинты

- `GET /api/trpc/profile.getOrdersHistory` - получение истории заказов
- `GET /api/trpc/profile.getOrderById` - получение деталей заказа по ID

### Параметры запросов

#### getOrdersHistory
```typescript
{
  status: "all" | "processing" | "shipping" | "delivered" | "cancelled";
  limit: number; // по умолчанию 20
  offset: number; // по умолчанию 0
}
```

#### getOrderById
```typescript
{
  orderId: string;
}
```

## Компоненты

### 1. OrdersHistory

Основной компонент для отображения списка заказов.

**Файл:** `apps/web/src/features/user-auth/components/orders-history.tsx`

**Функциональность:**
- Отображение списка заказов с фильтрацией по статусу
- Skeleton loading состояния
- Обработка ошибок
- Ссылки на детали заказов

**Использование:**
```tsx
import OrdersHistory from "@/features/user-auth/components/orders-history";

export default function OrdersPage() {
  return (
    <AuthGuard>
      <ProfileLayout>
        <OrdersHistory />
      </ProfileLayout>
    </AuthGuard>
  );
}
```

### 2. OrderDetails

Компонент для отображения деталей конкретного заказа.

**Файл:** `apps/web/src/features/user-auth/components/order-details.tsx`

**Функциональность:**
- Детальная информация о заказе
- Список товаров в заказе
- История статусов заказа
- Информация об отслеживании
- Адрес доставки

**Использование:**
```tsx
import { OrderDetails } from "@/features/user-auth/components/order-details";

export default function OrderPage({ params }: { params: { orderId: string } }) {
  return (
    <AuthGuard>
      <ProfileLayout>
        <OrderDetails orderId={params.orderId} />
      </ProfileLayout>
    </AuthGuard>
  );
}
```

## Хуки

### useOrders

Хук для получения списка заказов с фильтрацией и пагинацией.

**Файл:** `apps/web/src/features/user-auth/hooks/use-orders.ts`

**Параметры:**
```typescript
interface UseOrdersOptions {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}
```

**Возвращает:**
```typescript
{
  data: {
    orders: Order[];
    totalCount: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  error: Error | null;
}
```

**Использование:**
```tsx
import { useOrders } from "@/features/user-auth/hooks/use-orders";

function MyComponent() {
  const { data, isLoading, error } = useOrders({
    status: "processing",
    limit: 10,
    offset: 0,
  });
}
```

### useOrderById

Хук для получения деталей конкретного заказа.

**Параметры:**
```typescript
orderId: string;
```

**Возвращает:**
```typescript
{
  data: Order | undefined;
  isLoading: boolean;
  error: Error | null;
}
```

**Использование:**
```tsx
import { useOrderById } from "@/features/user-auth/hooks/use-orders";

function OrderDetails({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useOrderById(orderId);
}
```

## Типы данных

### OrderStatus
```typescript
type OrderStatus = "all" | "processing" | "shipping" | "delivered" | "cancelled";
```

### Order (основная структура)
```typescript
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  trackingNumber?: string;
  trackingUrl?: string;
  items: OrderItem[];
  shippingAddress?: Address;
}
```

### OrderItem
```