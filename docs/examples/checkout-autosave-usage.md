# Пример использования функции автосохранения черновиков оформления заказа

## Описание

Этот пример демонстрирует, как интегрировать функцию автосохранения черновиков оформления заказа в компонент страницы оформления заказа.

## Реализация

### 1. Подключение хука

```tsx
// apps/web/src/features/checkout/components/checkout-page.tsx

import { useCheckoutDraft } from "../hooks/use-checkout-draft";

const CheckoutPage = () => {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      // значения по умолчанию
    },
  });

  // Подключение хука автосохранения
  const { isDraftLoading } = useCheckoutDraft(form);

  // Подписка на изменения формы
  useEffect(() => {
    const subscription = form.watch((data) => {
      autoSave(data as CheckoutFormValues);
    });

    return () => subscription.unsubscribe();
  }, [form, autoSave]);

  // Отображение состояния загрузки
  if (isDraftLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    // JSX компонента
  );
};
```

### 2. Использование tRPC процедур

```ts
// packages/web-api/src/router/checkout.ts

import { getDraft } from "./checkout/get-draft";
import { saveDraft } from "./checkout/save-draft";

export const checkoutRouter = {
  // существующие процедуры
  getDraft,
  saveDraft,
} satisfies TRPCRouterRecord;
```

### 3. Схема базы данных

```ts
// packages/db/src/schemas/checkout-drafts/schema.ts

import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { customers } from "../customers/schema";

export const checkoutDrafts = pgTable("checkout_drafts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").references(() => customers.id, { onDelete: "cascade" }),
  sessionId: text("session_id"),
  draftData: jsonb("draft_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

## Тестирование

### Unit-тесты

```ts
// apps/web/src/features/checkout/hooks/__tests__/use-checkout-draft.test.ts

describe("useCheckoutDraft", () => {
  it("должен инициализировать хук без ошибок", () => {
    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft(form);
    });

    expect(result.current).toBeDefined();
    expect(result.current.isDraftLoading).toBe(false);
  });

  it("должен вызывать автосохранение при изменении данных формы", async () => {
    const { result } = renderHook(() => {
      const form = useForm();
      return useCheckoutDraft(form);
    });

    await act(async () => {
      await result.current.autoSave({
        firstName: "Иван",
        lastName: "Иванов",
        email: "ivan@example.com",
        // Другие поля формы
      });
    });

    // Проверяем, что функция автосохранения была вызвана
    expect(saveDraftMutation.mutateAsync).toHaveBeenCalled();
  });
});
```

## Преимущества

1. **Предотвращение потери данных**: Пользователи не теряют введенные данные при случайном закрытии страницы.
2. **Улучшенный UX**: Пользователи могут продолжить оформление заказа с того места, где остановились.
3. **Автоматическое сохранение**: Данные сохраняются автоматически без необходимости нажимать кнопку сохранения.
4. **Поддержка гостей**: Функциональность работает как для авторизованных пользователей, так и для гостей.

## Настройка

1. Убедитесь, что в базе данных создана таблица `checkout_drafts`.
2. Добавьте tRPC процедуры `getDraft` и `saveDraft`.
3. Подключите хук `useCheckoutDraft` к компоненту формы.
4. Настройте подписку на изменения формы для автосохранения.
