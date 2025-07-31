# Orders Feature

Модуль для управления заказами с использованием компонентов для отображения, редактирования и управления заказами.

## Структура модуля

```
orders/
├── components/          # UI компоненты
│   ├── bulk-delete-orders.tsx
│   ├── compact-order-table.tsx
│   ├── compact-order-view.tsx
│   ├── customer-info.tsx
│   ├── delete-order-button.tsx
│   ├── delivery-status.tsx
│   ├── delivery-status-badge.tsx
│   ├── delivery-status-manager.tsx
│   ├── desktop-orders-table.tsx
│   ├── detailed-order-view.tsx
│   ├── mobile-filter-panel.tsx
│   ├── order-actions.tsx
│   ├── order-card.tsx
│   ├── order-customer-info.tsx
│   ├── order-header.tsx
│   ├── order-history.tsx
│   ├── order-item-add.tsx
│   ├── order-items.tsx
│   ├── order-items-table.tsx
│   ├── order-overview.tsx
│   ├── order-selection.tsx
│   ├── order-status-select.tsx
│   ├── order-summary.tsx
│   ├── order-tabs.tsx
│   ├── orders-data-table.tsx
│   ├── orders-table-skeleton.tsx
│   ├── payment-info.tsx
│   ├── payment-status-manager.tsx
│   ├── product-search.tsx
│   ├── select-all-orders.tsx
│   ├── shipping-address-info.tsx
│   └── view-mode-toggle.tsx
├── hooks/              # Хуки для работы с данными
│   ├── use-is-mobile.ts
│   └── use-view-mode.ts
├── pages/              # Страничные компоненты
│   ├── order-details-header.tsx
│   ├── order-details-page.tsx
│   ├── order-details-skeleton.tsx
│   ├── order-details-toolbar.tsx
│   ├── orders-page.tsx
│   └── status-variants.ts
├── types/              # Типы и схемы
│   └── index.ts
├── utils/              # Утилиты
│   └── order-utils.ts
└── index.ts            # Экспорты модуля
```

## Основные компоненты

### OrdersPage

Основная страница для отображения списка заказов.

```tsx
import { OrdersPage } from "@/features/orders";

<OrdersPage />
```

### OrderDetailsPage

Страница для детального просмотра заказа.

```tsx
import { OrderDetailsPage } from "@/features/orders";

<OrderDetailsPage orderId={orderId} />
```

### CompactOrderTable

Компактная таблица заказов для мобильных устройств.

```tsx
import { CompactOrderTable } from "@/features/orders";

<CompactOrderTable
  orders={orders}
  selectedOrderIds={selectedOrderIds}
  onSelectionChange={handleSelectionChange}
/>
```

### DesktopOrdersTable

Полная таблица заказов для десктопа.

```tsx
import { DesktopOrdersTable } from "@/features/orders";

<DesktopOrdersTable
  orders={orders}
  selectedOrderIds={selectedOrderIds}
  onSelectionChange={handleSelectionChange}
/>
```

### DeliveryStatusManager

Компонент для управления статусом доставки.

```tsx
import { DeliveryStatusManager } from "@/features/orders";

<DeliveryStatusManager order={order} />
```

### PaymentStatusManager

Компонент для управления статусом оплаты.

```tsx
import { PaymentStatusManager } from "@/features/orders";

<PaymentStatusManager order={order} />
```

### BulkDeleteOrders

Компонент для массового удаления заказов.

```tsx
import { BulkDeleteOrders } from "@/features/orders";

<BulkDeleteOrders
  selectedOrders={selectedOrders}
  onSelectionChange={handleSelectionChange}
/>
```

## Хуки

### useViewMode

Хук для управления режимом отображения (компактный/полный).

```tsx
import { useViewMode } from "@/features/orders";

const { compactMode, setCompactMode } = useViewMode();
```

### useIsMobile

Хук для определения мобильного устройства.

```tsx
import { useIsMobile } from "@/features/orders";

const isMobile = useIsMobile();
```

## Утилиты

### order-utils

Утилиты для работы с заказами.

```tsx
import { 
  formatPrice,
  formatDate,
  formatDateTime,
  getTotalQuantity,
  getTotalAmount,
  isOrderPaid,
  getDeliveryStatus,
  getStatusColor,
  getStatusLabel,
  getPaymentMethodLabel,
  getDeliveryMethodLabel,
  getCustomerInitials,
  getCustomerName,
  getCustomerEmail,
  getCustomerPhone,
  getShippingAddress,
  filterOrdersByStatus,
  filterOrdersByDate,
  sortOrdersByDate,
  sortOrdersByAmount,
  searchOrders,
  validateOrderData
} from "@/features/orders";

const formattedPrice = formatPrice(1000);
const formattedDate = formatDate(new Date());
const totalQuantity = getTotalQuantity(order);
const totalAmount = getTotalAmount(order);
const isPaid = isOrderPaid(order);
const deliveryStatus = getDeliveryStatus(order.status);
```

## Страницы

### OrdersPage

Основная страница со списком заказов.

```tsx
import { OrdersPage } from "@/features/orders";

<OrdersPage />
```

### OrderDetailsPage

Страница детального просмотра заказа.

```tsx
import { OrderDetailsPage } from "@/features/orders";

<OrderDetailsPage orderId={orderId} />
```

## Zod Схемы

### Локальные схемы (в types/index.ts)

#### orderSchema

Схема для валидации заказа:

```tsx
const orderSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  orderNumber: z.string().optional(),
  customerName: z.string(),
  customerId: z.string().optional(),
  orderDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  totalAmount: z.number().min(0),
  orderStatus: z.string(),
  status: z.string(),
  paymentMethod: z.string(),
  paymentStatus: z.string().optional(),
  shippingMethod: z.string().optional(),
  shippingAmount: z.number().optional(),
  deliveryMethod: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  items: z.array(orderItemSchema),
  metadata: z.record(z.any()).optional(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
});
```

#### orderItemSchema

Схема для валидации элемента заказа:

```tsx
const orderItemSchema = z.object({
  id: z.string(),
  productSku: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
  productName: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
});
```

#### createOrderSchema

Схема для валидации создания заказа:

```tsx
const createOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
  paymentMethod: z.string(),
  shippingMethod: z.string(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});
```

#### updateOrderSchema

Схема для валидации обновления заказа:

```tsx
const updateOrderSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
});
```

#### orderFilterSchema

Схема для валидации фильтрации заказов:

```tsx
const orderFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  customerId: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});
```

## Типы

Все типы выводятся из Zod схем:

```tsx
// Типы из локальных схем
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderData = z.infer<typeof updateOrderSchema>;
export type OrderFilterData = z.infer<typeof orderFilterSchema>;
export type BulkDeleteOrdersData = z.infer<typeof bulkDeleteOrdersSchema>;
export type AddOrderItemData = z.infer<typeof addOrderItemSchema>;
export type UpdateDeliveryStatusData = z.infer<typeof updateDeliveryStatusSchema>;
export type UpdateTrackingData = z.infer<typeof updateTrackingSchema>;
```

## Использование

### Импорт компонентов

```tsx
import { 
  OrdersPage,
  OrderDetailsPage,
  CompactOrderTable,
  DesktopOrdersTable,
  DeliveryStatusManager,
  PaymentStatusManager,
  BulkDeleteOrders
} from "@/features/orders";
```

### Импорт хуков

```tsx
import { 
  useViewMode,
  useIsMobile
} from "@/features/orders";
```

### Импорт утилит

```tsx
import { 
  formatPrice,
  formatDate,
  getTotalQuantity,
  getTotalAmount,
  isOrderPaid,
  getDeliveryStatus,
  getStatusLabel,
  getCustomerName,
  searchOrders,
  validateOrderData
} from "@/features/orders";
```

### Импорт типов

```tsx
import { 
  Order,
  OrderItem,
  CreateOrderData,
  UpdateOrderData,
  OrderFilterData
} from "@/features/orders";
```

## Соответствие правилам проекта

✅ **UI компоненты из @qco/ui** - все импорты корректные  
✅ **Skeleton-компоненты** - есть OrdersTableSkeleton  
✅ **Структура features** - есть components, hooks, utils, types, pages  
✅ **Абсолютные пути** - используются @/ и @qco/ui  
✅ **Клиентские компоненты** - "use client" только где нужен интерактив  
✅ **Типы из Zod схем** - все типы выводятся из Zod схем  
✅ **Нет дублирующих типов** - все типы из Zod схем  
✅ **Серверные страницы** - есть OrdersPage и OrderDetailsPage с Suspense  

## Особенности

- **Адаптивный дизайн**: поддержка мобильных и десктопных устройств
- **Массовые операции**: удаление нескольких заказов одновременно
- **Управление статусами**: изменение статусов доставки и оплаты
- **Фильтрация и поиск**: поиск по номеру заказа, клиенту, статусу
- **Детальный просмотр**: полная информация о заказе с историей
- **Компактный режим**: оптимизированное отображение для мобильных устройств
- **Валидация данных**: все данные валидируются через Zod схемы
- **Типобезопасность**: все типы выводятся из Zod схем
- **Доступность**: использование компонентов shadcn/ui для accessibility
- **Консистентность**: единообразная структура всех компонентов
- **Централизованные схемы**: все схемы определены в types/index.ts 