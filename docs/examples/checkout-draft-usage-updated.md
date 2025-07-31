# Обновленный пример использования API черновиков оформления заказа

## Описание

Этот пример демонстрирует, как использовать обновленный API черновиков с новой структурой ответа, поддержкой частичных данных и информацией о полноте заполнения формы.

## Основные изменения

### 1. Новая структура ответа от getDraft

```typescript
// Старая структура
const draft = await trpc.checkout.getDraft.query({ customerId: "user_123" });
// draft = { id: "draft_123", draftData: {...}, createdAt: "...", updatedAt: "..." }

// Новая структура
const response = await trpc.checkout.getDraft.query({ customerId: "user_123" });
// response = {
//   success: true,
//   data: {
//     id: "draft_123",
//     customerId: "user_123",
//     sessionId: null,
//     draftData: { firstName: "Иван", lastName: "Иванов" },
//     createdAt: "2024-01-01T00:00:00Z",
//     updatedAt: "2024-01-01T00:00:00Z",
//     completeness: {
//       completedFields: ["firstName", "lastName"],
//       missingFields: ["email", "phone", "address"],
//       completionPercentage: 20,
//       isComplete: false
//     }
//   }
// }
```

### 2. Обновленный React хук

```typescript
// apps/web/src/features/checkout/hooks/use-checkout-draft.ts
import { useCheckoutDraft } from "../hooks/use-checkout-draft";

function CheckoutForm() {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { /* ... */ }
  });

  const { 
    draft,           // Данные черновика (null если нет данных)
    isDraftLoading,  // Состояние загрузки
    draftError,      // Ошибка загрузки (null если нет ошибки)
    completeness,    // Информация о полноте данных
    saveDraft,       // Функция сохранения измененных полей
    saveFullDraft,   // Функция сохранения всех данных
    isSaving         // Состояние сохранения
  } = useCheckoutDraft({ form });

  // Отображение прогресса
  if (completeness) {
    console.log(`Заполнено: ${completeness.completionPercentage}%`);
    console.log(`Осталось полей: ${completeness.missingFields.length}`);
  }

  // Обработка ошибок
  if (draftError) {
    console.warn("Ошибка загрузки черновика:", draftError);
  }

  return (
    <div>
      {/* Индикатор прогресса */}
      {completeness && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completeness.completionPercentage}%` }}
          />
          <span>{completeness.completionPercentage}% заполнено</span>
        </div>
      )}

      {/* Индикатор сохранения */}
      {isSaving && <div>Сохранение...</div>}

      {/* Форма */}
      <form>
        {/* Поля формы */}
      </form>
    </div>
  );
}
```

### 3. Валидация частичных данных

```typescript
// Валидация данных черновика
const validation = await trpc.checkout.validateDraft.query({
  draftData: {
    firstName: "Иван",
    email: "invalid-email", // Неверный email
    phone: "123" // Слишком короткий номер
  }
});

// Ответ:
{
  success: true,
  validation: {
    isValid: false,
    errors: {
      email: ["Введите корректный email"],
      phone: ["Телефон должен содержать минимум 10 цифр"]
    },
    validData: { firstName: "Иван" }
  },
  completeness: {
    completedFields: ["firstName"],
    missingFields: ["lastName", "email", "phone", "address", "city", "state", "postalCode", "shippingMethod", "paymentMethod"],
    completionPercentage: 10,
    isComplete: false
  },
  recommendations: [
    "email: Введите корректный email",
    "phone: Телефон должен содержать минимум 10 цифр",
    "Заполните имя и фамилию для оформления заказа",
    "Укажите email для получения подтверждения заказа"
  ]
}
```

### 4. Утилиты для работы с данными

```typescript
import { 
  mergeDraftData, 
  cleanDraftData, 
  getFormProgress,
  getProgressMessage,
  groupValidationErrors 
} from "@qco/web-api/lib/draft-utils";

// Объединение данных
const mergedData = mergeDraftData(existingDraft, newData);

// Очистка пустых значений
const cleanedData = cleanDraftData(draftData);

// Получение прогресса
const progress = getFormProgress(completeness); // 60
const message = getProgressMessage(completeness); // "Заполнено наполовину. Осталось 4 полей"

// Группировка ошибок
const groupedErrors = groupValidationErrors(validationErrors);
// {
//   contact: ["Введите корректный email"],
//   address: ["Заполните адрес доставки"],
//   shipping: [],
//   payment: [],
//   other: []
// }
```

## Полный пример компонента

```typescript
// apps/web/src/features/checkout/components/checkout-form.tsx
import { useForm } from "react-hook-form";
import { useCheckoutDraft } from "../hooks/use-checkout-draft";
import { CheckoutFormValues } from "@qco/web-validators";
import { getProgressMessage, groupValidationErrors } from "@qco/web-api/lib/draft-utils";

export function CheckoutForm() {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      shippingMethod: "",
      paymentMethod: "cash-on-delivery",
    }
  });

  const { 
    draft, 
    isDraftLoading, 
    draftError, 
    completeness, 
    saveDraft, 
    isSaving 
  } = useCheckoutDraft({ form });

  // Валидация данных
  const { data: validation } = trpc.checkout.validateDraft.useQuery({
    draftData: form.getValues()
  });

  // Получение прогресса и ошибок
  const progressMessage = completeness ? getProgressMessage(completeness) : "";
  const groupedErrors = validation?.validation?.errors ? 
    groupValidationErrors(validation.validation.errors) : {};

  if (isDraftLoading) {
    return <div>Загрузка сохраненных данных...</div>;
  }

  return (
    <div className="checkout-form">
      {/* Индикатор прогресса */}
      {completeness && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completeness.completionPercentage}%` }}
            />
          </div>
          <span className="progress-text">{progressMessage}</span>
        </div>
      )}

      {/* Ошибки валидации */}
      {Object.keys(groupedErrors).length > 0 && (
        <div className="validation-errors">
          {Object.entries(groupedErrors).map(([group, errors]) => (
            <div key={group} className={`error-group ${group}`}>
              <h4>{group === 'contact' ? 'Контактная информация' : 
                   group === 'address' ? 'Адрес доставки' :
                   group === 'shipping' ? 'Способ доставки' :
                   group === 'payment' ? 'Способ оплаты' : 'Другие ошибки'}</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Индикатор сохранения */}
      {isSaving && (
        <div className="save-indicator">
          <div className="spinner"></div>
          <span>Сохранение данных...</span>
        </div>
      )}

      {/* Ошибка загрузки черновика */}
      {draftError && (
        <div className="draft-error">
          <p>Не удалось загрузить сохраненные данные: {draftError}</p>
        </div>
      )}

      {/* Форма */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Поля формы с автосохранением */}
        <input 
          {...form.register("firstName")}
          onBlur={() => saveDraft()}
        />
        {/* Остальные поля */}
      </form>
    </div>
  );
}
```

## Миграция с старой версии

### 1. Обновление хука

```typescript
// Старая версия
const { data: draftData, isLoading: isDraftLoading } = useQuery({
  ...getDraftQueryOptions,
  enabled: !isCartLoading && (Boolean(customerId) || Boolean(cart?.sessionId)),
});

// Новая версия
const { data: draftResponse, isLoading: isDraftLoading, error: draftError } = useQuery({
  ...getDraftQueryOptions,
  enabled: !isCartLoading && (Boolean(customerId) || Boolean(cart?.sessionId)),
});

const draftData = draftResponse?.success ? draftResponse.data : null;
```

### 2. Обновление обработки данных

```typescript
// Старая версия
useEffect(() => {
  if (draftData?.draftData) {
    form.reset(draftData.draftData);
  }
}, [draftData, form]);

// Новая версия
useEffect(() => {
  if (draftData?.draftData) {
    form.reset(draftData.draftData as CheckoutFormValues);
  }
}, [draftData, form]);
```

### 3. Добавление новых возможностей

```typescript
// Новые возможности
const { 
  draft, 
  isDraftLoading, 
  draftError,        // Новое
  completeness,      // Новое
  saveDraft, 
  saveFullDraft, 
  createOnBlurHandler, 
  isSaving 
} = useCheckoutDraft({ form });

// Использование новых возможностей
if (completeness) {
  console.log(`Прогресс: ${completeness.completionPercentage}%`);
}

if (draftError) {
  console.warn("Ошибка загрузки:", draftError);
}
```

## Преимущества новой версии

1. **Лучшая обработка ошибок** - четкое разделение успешных и неуспешных ответов
2. **Информация о прогрессе** - пользователь видит, сколько полей осталось заполнить
3. **Валидация частичных данных** - можно сохранять неполные данные
4. **Группировка ошибок** - ошибки сгруппированы по категориям для лучшего UX
5. **Типобезопасность** - полная типизация всех ответов API
6. **Обратная совместимость** - старый код можно постепенно мигрировать
7. **Упрощенная структура** - убраны поля billingAddress, так как в России адрес доставки совпадает с адресом оплаты 