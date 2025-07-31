# API Заказов

## Обзор

API для работы с заказами предоставляет функциональность для создания, получения и управления заказами.

## Endpoints

### 1. Создание заказа

**Endpoint:** `POST /api/trpc/orders.createOrder`

**Описание:** Создает новый заказ на основе данных корзины и информации о клиенте.

**Параметры:**
```typescript
{
  cartId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    saveAddress?: boolean;
  };
  shippingMethod: {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDelivery: string;
  };
  paymentMethod: {
    id: string;
    type: "credit_card" | "cash_on_delivery" | "bank_transfer" | "digital_wallet";
    name: string;
    description?: string;
  };
  createProfile?: boolean;
}
```

**Ответ:**
```typescript
{
  success: boolean;
  orderId: string;
}
```

### 2. Получение заказа по ID

**Endpoint:** `GET /api/trpc/orders.getOrder`

**Описание:** Получает детальную информацию о заказе по его ID.

**Параметры:**
```typescript
{
  orderId: string;
}
```

**Ответ:**
```typescript
{
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  subtotalAmount: number;
  shippingAmount: number;
  discountAmount: number;
  taxAmount: number;
  paymentMethod: string;
  shippingMethod: string;
  customerId: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    totalPrice: number;
    productName: string;
    productSku?: string;
    variantName?: string;
    attributes: Record<string, any>;
    image?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  metadata?: Record<string, any>;
}
```

### 3. Получение списка заказов

**Endpoint:** `GET /api/trpc/orders.getOrders`

**Описание:** Получает список заказов с пагинацией и фильтрацией.

**Параметры:**
```typescript
{
  limit?: number; // По умолчанию: 20, максимум: 100
  offset?: number; // По умолчанию: 0
  status?: string; // Фильтр по статусу заказа
  customerId?: string; // Фильтр по ID клиента
  orderNumber?: string; // Фильтр по номеру заказа
}
```

**Ответ:**
```typescript
{
  orders: Array<Order>; // Массив заказов
  pagination: {
    total: number; // Общее количество заказов
    limit: number; // Количество заказов на странице
    offset: number; // Смещение
    hasMore: boolean; // Есть ли еще страницы
    totalPages: number; // Общее количество страниц
    currentPage: number; // Текущая страница
  };
}
```

## Статусы заказов

- `pending` - Ожидает оплаты
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен

## Способы оплаты

- `credit_card` - Банковская карта
- `cash_on_delivery` - Наличные при получении
- `bank_transfer` - Банковский перевод
- `digital_wallet` - Электронный кошелек

## Примеры использования

### Создание заказа

```typescript
const result = await trpc.orders.createOrder.mutate({
  cartId: "cart-123",
  customerInfo: {
    email: "customer@example.com",
    firstName: "Иван",
    lastName: "Иванов",
    phone: "+7 (999) 123-45-67",
    address: "ул. Пушкина, д. 10",
    city: "Москва",
    state: "Московская область",
    postalCode: "123456",
    saveAddress: true,
  },
  shippingMethod: {
    id: "standard",
    name: "Стандартная доставка",
    description: "Доставка 1-3 дня",
    price: 300,
    estimatedDelivery: "1-3 дня",
  },
  paymentMethod: {
    id: "cash",
    type: "cash_on_delivery",
    name: "Наличные курьеру",
    description: "Оплата при получении",
  },
  createProfile: true,
});
```

### Получение списка заказов

```typescript
const { orders, pagination } = await trpc.orders.getOrders.query({
  limit: 10,
  offset: 0,
  status: "pending",
});
```

### Получение заказа по ID

```typescript
const order = await trpc.orders.getOrder.query({
  orderId: "order-123",
});
```

## Обработка ошибок

API возвращает стандартные HTTP коды ошибок:

- `400 Bad Request` - Неверные параметры запроса
- `404 Not Found` - Заказ не найден
- `500 Internal Server Error` - Внутренняя ошибка сервера

## Пагинация

Для списков заказов используется пагинация на основе offset/limit:

- `limit` - количество элементов на странице (1-100)
- `offset` - смещение от начала списка
- `total` - общее количество элементов
- `hasMore` - есть ли еще страницы
- `totalPages` - общее количество страниц
- `currentPage` - текущая страница

## Фильтрация

Поддерживаются следующие фильтры:

- **По статусу** - фильтрация заказов по статусу
- **По клиенту** - фильтрация заказов конкретного клиента
- **По номеру заказа** - поиск по номеру заказа

## Кэширование

Все запросы используют React Query с настройками кэширования:

- **staleTime:** 5 минут - данные считаются свежими в течение 5 минут
- **gcTime:** 10 минут - данные хранятся в кэше 10 минут

## Безопасность

- Все входные данные валидируются через Zod схемы
- Поддерживается аутентификация для защищенных операций
- Валидация прав доступа к заказам 