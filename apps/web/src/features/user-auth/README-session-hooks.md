# Обновление хуков с проверкой сессии

## Обзор изменений

Все хуки, которые работают с данными пользователя, теперь используют параметр `enabled` в `queryOptions` для условного выполнения запросов только при наличии активной сессии.

## Обновленные хуки

### 1. `useAccountStats`
**Файл**: `apps/web/src/features/user-auth/hooks/use-account-stats.ts`

**Изменения**:
- Добавлен импорт `useSession`
- Добавлена проверка `isAuthenticated`
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`
- Возвращает дополнительное поле `isAuthenticated`

### 2. `useProfileStats`
**Файл**: `apps/web/src/features/user-auth/hooks/use-profile-stats.ts`

**Изменения**:
- Добавлен импорт `useSession`
- Добавлена проверка `isAuthenticated`
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`

### 3. `useProfile`
**Файл**: `apps/web/src/features/user-auth/hooks/use-profile.ts`

**Изменения**:
- Добавлен импорт `useSession`
- Добавлена проверка `isAuthenticated`
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`

### 4. `useAddresses`
**Файл**: `apps/web/src/features/user-auth/hooks/use-addresses.ts`

**Изменения**:
- Добавлен импорт `useSession`
- Добавлена проверка `isAuthenticated`
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`

### 5. `useFavorites` (user-auth)
**Файл**: `apps/web/src/features/user-auth/hooks/use-favorites.ts`

**Изменения**:
- Добавлен импорт `useSession`
- Добавлена проверка `isAuthenticated`
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`

### 6. `useFavorites` (favorites)
**Файл**: `apps/web/src/features/favorites/hooks/use-favorites.ts`

**Изменения**:
- Добавлен параметр `enabled: isAuthenticated` в `queryOptions`

### 7. `useFavoritesCount`
**Файл**: `apps/web/src/features/favorites/hooks/use-favorites-count.ts`

**Изменения**:
- Добавлен параметр `enabled: !!session` в `queryOptions`
- Оптимизирована логика условного выполнения запроса

## Преимущества

### 1. Экономия ресурсов
- Запросы не выполняются для неавторизованных пользователей
- Снижение нагрузки на сервер
- Уменьшение количества сетевых запросов

### 2. Улучшенная производительность
- Более быстрая загрузка страниц для неавторизованных пользователей
- Меньше времени ожидания для пользователей
- Оптимизированное использование памяти

### 3. Предсказуемое поведение
- Компоненты не показывают ошибки авторизации
- Graceful fallback для неавторизованных пользователей
- Более стабильная работа приложения

### 4. Лучший UX
- Нет лишних индикаторов загрузки
- Понятное поведение для пользователей
- Корректная работа с локальными данными

## Пример использования

```tsx
import { useAccountStats } from "@/features/user-auth/hooks/use-account-stats";

function MyComponent() {
  const { stats, statsLoading, isAuthenticated } = useAccountStats();

  if (!isAuthenticated) {
    return <div>Пожалуйста, войдите в систему</div>;
  }

  if (statsLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <p>Заказы: {stats?.orders?.total || 0}</p>
      <p>Избранное: {stats?.favorites || 0}</p>
    </div>
  );
}
```

## Тестирование

Для тестирования обновленных хуков создан компонент `AuthHooksTest`:
- Демонстрирует работу всех хуков
- Показывает статус сессии
- Отображает данные только для авторизованных пользователей
- Показывает fallback для неавторизованных пользователей

## Совместимость

Все изменения обратно совместимы:
- Существующие компоненты продолжают работать
- API хуков не изменился
- Дополнительные поля опциональны
- Fallback логика сохранена 