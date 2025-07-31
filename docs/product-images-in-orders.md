# Добавление изображений товаров в заказы

## Обзор

Добавлена поддержка главных изображений товаров в API для получения истории заказов и деталей заказа. Теперь каждый элемент заказа содержит поле `image` с URL главного изображения товара.

## Изменения

### 1. Обновлена схема валидации

**Файл:** `packages/web-validators/src/account.ts`

Добавлено поле `image` в схему `OrderItemSchema`:

```typescript
export const OrderItemSchema = z.object({
  // ... существующие поля
  image: z.string().nullable().optional(), // Главное изображение товара
  // ... остальные поля
});
```

### 2. Создана утилита для получения изображений

**Файл:** `packages/web-api/src/lib/product-images.ts`

Создана функция `getProductMainImages` для получения главных изображений товаров:

```typescript
export async function getProductMainImages(
    db: any,
    productIds: string[]
): Promise<Record<string, string | null>>
```

**Функциональность:**
- Получает изображения товаров из таблиц `productFiles` и `files`
- Приоритет отдается изображениям с типом `main`
- Возвращает объект с URL изображений, где ключ - ID товара
- Обрабатывает ошибки и возвращает пустой объект при проблемах

### 3. Обновлен API получения истории заказов

**Файл:** `packages/web-api/src/router/profile/get-orders-history.ts`

Добавлена логика получения изображений товаров:

```typescript
// Получаем главные изображения товаров
const productIds = Array.from(new Set(orderItemsData.map(item => item.productId)));
const productMainImages = await getProductMainImages(ctx.db, productIds);

// В ответе добавляем изображение к каждому элементу заказа
items: safeMap(orderItemsForOrder, (item: any) => ({
    // ... существующие поля
    image: productMainImages[item.productId] || null,
    // ... остальные поля
})),
```

### 4. Обновлен API получения заказа по ID

**Файл:** `packages/web-api/src/router/profile/get-order-by-id.ts`

Аналогично добавлена поддержка изображений товаров.

## Структура ответа

Теперь каждый элемент заказа содержит поле `image`:

```typescript
{
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image: string | null; // URL главного изображения товара или null
  product: null;
  variant: null;
}
```

## Логика получения изображений

1. **Извлечение ID товаров** - собираем уникальные ID товаров из элементов заказа
2. **Запрос к БД** - получаем файлы товаров с приоритетом по типу `main`
3. **Формирование URL** - используем `getFileUrl` для преобразования пути в полный URL
4. **Сопоставление** - связываем изображения с товарами по ID

## Тестирование

**Файл:** `packages/web-api/test/profile/get-orders-history.test.ts`

Созданы тесты для утилиты `getProductMainImages`:

- Тест с пустым массивом ID товаров
- Тест с товарами, имеющими изображения
- Тест с товарами без изображений
- Тест обработки ошибок БД

## Совместимость

Изменения обратно совместимы:
- Поле `image` является опциональным
- При отсутствии изображения возвращается `null`
- Существующие API продолжают работать без изменений

## Производительность

- Изображения получаются одним запросом для всех товаров в заказе
- Используется JOIN для оптимизации запроса
- Результаты кэшируются в объекте для быстрого доступа
- Обработка ошибок не прерывает выполнение основного запроса 