# Сохранение контактной информации при оформлении заказа

## Обзор

При оформлении заказа система теперь сохраняет полную контактную информацию пользователя, включая название компании. Это позволяет создавать более полные профили и улучшать качество обслуживания клиентов.

## Функциональность

### 1. Сохранение контактных данных

При оформлении заказа сохраняются следующие данные:
- **Имя** (`firstName`)
- **Фамилия** (`lastName`)
- **Email** (`email`)
- **Телефон** (`phone`)
- **Компания** (`company`) - новое поле
- **Дата рождения** (`dateOfBirth`) - для будущего использования
- **Пол** (`gender`) - для будущего использования

### 2. Обновление существующих профилей

Если пользователь уже существует в системе:
- Система проверяет, изменились ли данные
- Обновляет только те поля, которые действительно изменились
- Сохраняет историю изменений через `updatedAt`

### 3. Создание новых профилей

Для новых пользователей:
- Создается полный профиль со всеми переданными данными
- Устанавливается `isGuest: false` если выбран `createProfile: true`

## Реализация

### Backend

#### 1. Обновленный интерфейс CustomerData

```typescript
interface CustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;        // Новое поле
  dateOfBirth?: Date;      // Для будущего использования
  gender?: string;         // Для будущего использования
}
```

#### 2. Обновленная функция findOrCreateCustomerByEmail

```typescript
export async function findOrCreateCustomerByEmail(data: CustomerData & { isGuest?: boolean }) {
  // Поиск существующего пользователя
  const customer = await db.query.customers.findFirst({
    where: eq(customers.email, data.email),
  });

  if (customer) {
    // Обновление существующего пользователя
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Обновляем только изменившиеся поля
    if (data.firstName && data.firstName !== customer.firstName) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName && data.lastName !== customer.lastName) {
      updateData.lastName = data.lastName;
    }
    if (data.phone && data.phone !== customer.phone) {
      updateData.phone = data.phone;
    }
    if (data.company && data.company !== customer.name) {
      updateData.name = data.company; // Компания сохраняется в поле name
    }
    // ... другие поля

    if (Object.keys(updateData).length > 1) {
      return await db.update(customers).set(updateData).where(eq(customers.id, customer.id)).returning();
    }

    return customer;
  }

  // Создание нового пользователя
  return await db.insert(customers).values({
    customerCode: await generateCustomerCode(),
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    name: data.company, // Компания сохраняется в поле name
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    isGuest: data.isGuest ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
}
```

### Frontend

#### 1. Обновленная форма контактной информации

```tsx
<FormField
  control={form.control}
  name="company"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Компания</FormLabel>
      <FormControl>
        <Input
          placeholder="Название компании (необязательно)"
          {...field}
        />
      </FormControl>
      <FormDescription>
        Укажите название компании, если заказ оформляется от имени организации
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### 2. Обновленная схема валидации

```typescript
const checkoutFormSchema = z.object({
  // Контактная информация
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),
  company: z.string().optional(), // Новое поле

  // ... остальные поля
});
```

#### 3. Передача данных в API

```typescript
const customerInfo = {
  email: values.email,
  firstName: values.firstName,
  lastName: values.lastName,
  phone: values.phone,
  company: values.company, // Передаем компанию
  address: values.address,
  apartment: values.apartment,
  city: values.city,
  state: values.state,
  postalCode: values.postalCode,
};
```

## База данных

### Структура таблицы customers

```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  customer_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),           -- Используется для хранения названия компании
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth TIMESTAMP,
  gender VARCHAR(20),
  is_guest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Маппинг полей

| Поле формы | Поле БД | Описание |
|------------|---------|----------|
| `company` | `name` | Название компании |
| `firstName` | `first_name` | Имя |
| `lastName` | `last_name` | Фамилия |
| `email` | `email` | Email |
| `phone` | `phone` | Телефон |

## Тестирование

### Тесты для сохранения контактной информации

1. **Сохранение новой компании** - проверяет, что компания сохраняется при создании нового профиля
2. **Обновление существующей компании** - проверяет, что компания обновляется у существующего пользователя
3. **Без изменений** - проверяет, что данные не обновляются, если они не изменились

### Запуск тестов

```bash
cd packages/web-api
npm test -- create-order-contact-info.test.ts
```

## Использование

### Для пользователей

1. При оформлении заказа заполните поле "Компания" (необязательно)
2. Если вы создаете профиль (`createProfile: true`), компания сохранится в вашем профиле
3. При следующих заказах компания будет автоматически заполнена из профиля

### Для разработчиков

1. Поле `company` передается в `customerInfo` при создании заказа
2. Компания сохраняется в поле `name` таблицы `customers`
3. При обновлении профиля проверяется, изменилась ли компания
4. Обновляется только `updatedAt`, если данные не изменились

## Будущие улучшения

1. **Дополнительные поля** - добавление полей `dateOfBirth` и `gender` в форму
2. **Валидация компании** - проверка корректности названия компании
3. **Автодополнение** - предложение существующих компаний при вводе
4. **Импорт данных** - возможность импорта контактных данных из внешних источников 