# Черновики оформления заказа для анонимных пользователей

## Обзор

Система черновиков оформления заказа теперь поддерживает как авторизованных, так и анонимных пользователей. Анонимные пользователи могут сохранять и восстанавливать данные формы оформления заказа с помощью уникального `sessionId`.

## Основные возможности

### 1. Поддержка анонимных пользователей
- Анонимные пользователи могут сохранять черновики с помощью `sessionId`
- Автоматическая миграция черновиков при авторизации пользователя
- Безопасное хранение данных без привязки к личному аккаунту

### 2. Автоматическая миграция
- При авторизации пользователя черновики автоматически переносятся с `sessionId` на `customerId`
- Данные сохраняются и объединяются при миграции
- Прозрачный процесс для пользователя

### 3. Валидация частичных данных
- Поддержка сохранения неполных данных формы
- Детальная валидация каждого поля
- Проверка полноты данных с процентным показателем
- Группировка ошибок по категориям

### 4. Очистка старых данных
- Автоматическая очистка старых черновиков анонимных пользователей
- Настраиваемый период хранения (по умолчанию 30 дней)

## API Endpoints

### Получение черновика

```typescript
// Для авторизованных пользователей
const draft = await trpc.checkout.getDraft.query({
  customerId: "user_123"
});

// Для анонимных пользователей
const draft = await trpc.checkout.getDraft.query({
  sessionId: "session_abc123"
});
```

**Ответ:**
```typescript
{
  success: true,
  data: {
    id: "draft_123",
    customerId: "user_123" | null,
    sessionId: "session_abc123" | null,
    draftData: { /* частичные данные формы */ },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    completeness: {
      completedFields: ["firstName", "lastName"],
      missingFields: ["email", "phone", "address"],
      completionPercentage: 20,
      isComplete: false
    }
  }
}
```

### Сохранение черновика

```typescript
// Сохранение частичных данных
const result = await trpc.checkout.saveDraft.mutate({
  sessionId: "session_abc123",
  draftData: { 
    firstName: "Иван", 
    lastName: "Иванов",
    // email и другие поля могут отсутствовать
  }
});

// При авторизации (автоматическая миграция)
const result = await trpc.checkout.saveDraft.mutate({
  customerId: "user_123",
  sessionId: "session_abc123", // Существующий sessionId
  draftData: { email: "ivan@example.com" }
});
```

### Валидация данных черновика

```typescript
// Валидация частичных данных
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

### Удаление черновика

```typescript
// Удаление по ID
await trpc.checkout.deleteDraft.mutate({
  draftId: "draft_123"
});

// Удаление всех черновиков пользователя
await trpc.checkout.deleteDraft.mutate({
  customerId: "user_123"
});

// Удаление всех черновиков сессии
await trpc.checkout.deleteDraft.mutate({
  sessionId: "session_abc123"
});
```

### Очистка старых черновиков

```typescript
// Очистка черновиков старше 30 дней (по умолчанию)
await trpc.checkout.cleanupOldDrafts.mutate({});

// Очистка черновиков старше 7 дней
await trpc.checkout.cleanupOldDrafts.mutate({
  daysOld: 7
});
```

## Утилиты для работы с сессиями

### Генерация sessionId

```typescript
import { generateSessionId, isValidSessionId } from "@qco/web-api/lib/session-utils";

// Генерация нового sessionId
const sessionId = generateSessionId(); // "session_abc123def456"

// Проверка валидности
const isValid = isValidSessionId(sessionId); // true
```

### Создание параметров для черновиков

```typescript
import { createDraftParams } from "@qco/web-api/lib/session-utils";

// Для авторизованного пользователя
const params = createDraftParams({ customerId: "user_123" });
// { customerId: "user_123", sessionId: undefined }

// Для анонимного пользователя
const params = createDraftParams({ sessionId: "session_abc123" });
// { customerId: undefined, sessionId: "session_abc123" }

// Автоматическая генерация sessionId
const params = createDraftParams({});
// { customerId: undefined, sessionId: "session_newly_generated_id" }
```

## Утилиты для работы с частичными данными

### Валидация данных

```typescript
import { validateDraftData, checkDraftCompleteness } from "@qco/web-validators";

// Валидация частичных данных
const validation = validateDraftData({
  firstName: "Иван",
  email: "ivan@example.com"
});

// Проверка полноты данных
const completeness = checkDraftCompleteness({
  firstName: "Иван",
  lastName: "Иванов",
  email: "ivan@example.com"
  // Остальные поля отсутствуют
});
```

### Работа с данными на фронтенде

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

## Схемы валидации

### Основные схемы

```typescript
import { 
  checkoutFormSchema,           // Полная схема (все поля обязательные)
  checkoutDraftSchema,          // Схема черновика (все поля опциональные)
  checkoutDraftPartialSchema,   // Схема для частичных данных
  checkoutContactInfoDraftSchema,    // Схема контактной информации
  checkoutShippingAddressDraftSchema, // Схема адреса доставки
  checkoutShippingMethodDraftSchema,  // Схема способа доставки
  checkoutPaymentMethodDraftSchema    // Схема способа оплаты
} from "@qco/web-validators";
```

### Типы данных

```typescript
import { 
  CheckoutFormValues,           // Тип полной формы
  CheckoutDraftValues,          // Тип черновика
  CheckoutDraftPartialValues,   // Тип частичных данных
  DraftValidationResult,        // Результат валидации
  DraftCompletenessResult       // Результат проверки полноты
} from "@qco/web-validators";
```

## Лучшие практики

### 1. Генерация sessionId
- Генерируйте `sessionId` при первом посещении страницы оформления заказа
- Сохраняйте `sessionId` в localStorage или sessionStorage
- Используйте утилиту `generateSessionId()` для создания уникальных идентификаторов

### 2. Обработка авторизации
- При авторизации пользователя передавайте и `customerId`, и `sessionId`
- Система автоматически мигрирует черновики
- После успешной миграции можно очистить `sessionId` из хранилища

### 3. Валидация частичных данных
- Используйте `checkoutDraftPartialSchema` для валидации частичных данных
- Проверяйте полноту данных с помощью `checkDraftCompleteness`
- Группируйте ошибки для лучшего UX
- Показывайте прогресс заполнения формы

### 4. Автосохранение
- Сохраняйте данные при изменении полей (с debounce)
- Используйте только заполненные поля для экономии трафика
- Проверяйте изменения перед сохранением
- Показывайте индикатор сохранения

### 5. Обработка ошибок
- Всегда проверяйте поле `success` в ответах API
- Обрабатывайте случаи, когда черновик не найден
- Логируйте ошибки валидации данных
- Показывайте пользователю понятные сообщения об ошибках

### 6. Производительность
- Используйте частичное сохранение данных
- Не сохраняйте черновики слишком часто (рекомендуется debounce 2-3 секунды)
- Регулярно очищайте старые черновики
- Кэшируйте данные черновика на клиенте

## Пример использования на фронтенде

```typescript
import { useTRPC } from "~/trpc/react";
import { generateSessionId } from "@qco/web-api/lib/session-utils";
import { 
  mergeDraftData, 
  cleanDraftData, 
  getProgressMessage,
  groupValidationErrors 
} from "@qco/web-api/lib/draft-utils";
import { useDebounce } from "~/hooks/use-debounce";

function CheckoutForm() {
  const trpc = useTRPC();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutDraftPartialValues>({});
  const [originalData, setOriginalData] = useState<CheckoutDraftPartialValues | null>(null);
  
  // Debounced данные для автосохранения
  const debouncedData = useDebounce(formData, 2000);
  
  // Генерация sessionId при инициализации
  useEffect(() => {
    const storedSessionId = localStorage.getItem('checkout_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      localStorage.setItem('checkout_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Загрузка черновика
  const { data: draft } = trpc.checkout.getDraft.useQuery({
    sessionId: sessionId || undefined
  });

  // Заполнение формы данными из черновика
  useEffect(() => {
    if (draft?.success && draft.data?.draftData) {
      setFormData(draft.data.draftData);
      setOriginalData(draft.data.draftData);
    }
  }, [draft]);

  // Автосохранение при изменении данных
  const saveDraftMutation = trpc.checkout.saveDraft.useMutation();
  
  useEffect(() => {
    if (debouncedData && Object.keys(debouncedData).length > 0) {
      const cleanedData = cleanDraftData(debouncedData);
      saveDraftMutation.mutate({
        sessionId: sessionId || undefined,
        draftData: cleanedData
      });
    }
  }, [debouncedData, sessionId]);

  // Валидация данных
  const { data: validation } = trpc.checkout.validateDraft.useQuery({
    draftData: formData
  });

  // Обработка изменений формы
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // При авторизации пользователя
  const handleUserLogin = (customerId: string) => {
    // Мигрируем черновик к авторизованному пользователю
    saveDraftMutation.mutate({
      customerId,
      sessionId: sessionId || undefined,
      draftData: formData
    });
    
    // Очищаем sessionId
    localStorage.removeItem('checkout_session_id');
    setSessionId(null);
  };

  // Получение прогресса и ошибок
  const progress = validation?.completeness ? getProgressMessage(validation.completeness) : "";
  const groupedErrors = validation?.validation?.errors ? groupValidationErrors(validation.validation.errors) : {};

  return (
    <div>
      {/* Индикатор прогресса */}
      {progress && (
        <div className="progress-indicator">
          <div className="progress-bar" style={{ width: `${validation?.completeness?.completionPercentage || 0}%` }} />
          <span>{progress}</span>
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

      {/* Форма оформления заказа */}
      <form>
        {/* Поля формы */}
      </form>

      {/* Индикатор сохранения */}
      {saveDraftMutation.isPending && (
        <div className="save-indicator">Сохранение...</div>
      )}
    </div>
  );
}
```

## Безопасность

- `sessionId` генерируется с использованием криптографически стойкого алгоритма
- Черновики анонимных пользователей автоматически очищаются
- Данные валидируются при каждом обращении
- Нет доступа к черновикам других пользователей
- Частичные данные проверяются на корректность

## Мониторинг

- Логируются ошибки валидации данных черновиков
- Отслеживается количество миграций черновиков
- Мониторится количество удаленных старых черновиков
- Алерты при критических ошибках в работе системы
- Статистика по полноте заполнения форм 