# Тестирование Web API

Этот документ описывает инфраструктуру тестирования для пакета `@qco/web-api`, созданную с использованием **Vitest**.

## Структура тестов

```
test/
├── setup.ts                    # Глобальная настройка тестов
├── utils/
│   └── test-helpers.ts         # Вспомогательные функции для тестов
├── categories/                 # Тесты для роутера категорий
│   ├── get-all.test.ts
│   ├── get-by-slug.test.ts
│   ├── get-category-hierarchy.test.ts
│   ├── get-children-by-parent.test.ts
│   ├── get-root.test.ts
│   ├── get-tree.test.ts
│   ├── get-with-products.test.ts
│   ├── get-with-products-simple.test.ts
│   ├── index.test.ts
│   └── integration.test.ts
└── README.md                   # Этот файл
```

## Запуск тестов

### Установка зависимостей
```bash
bun install
```

### Запуск всех тестов
```bash
bun test
```

### Запуск тестов в режиме watch
```bash
bun test --watch
```

### Запуск тестов с покрытием
```bash
bun test:coverage
```

### Запуск конкретного теста
```bash
bun test categories/get-all.test.ts
```

## Конфигурация

### Vitest Config (`vitest.config.ts`)
- **Environment**: Node.js
- **Globals**: Включены для удобства
- **Coverage**: V8 provider с HTML, JSON и текстовыми отчетами
- **Aliases**: Настроены для `@` и `~` путей

### Setup (`test/setup.ts`)
Глобальная настройка включает:
- Моки для всех внешних зависимостей
- Настройка глобальных переменных
- Отключение логов в тестах

## Вспомогательные функции

### `test-helpers.ts`

#### `createMockCategory(overrides?)`
Создает тестовые данные категории с возможностью переопределения полей.

```typescript
const category = createMockCategory({
  id: 'custom-id',
  name: 'Custom Name',
  productsCount: 10
})
```

#### `createMockContext()`
Создает мок контекста для tRPC процедур.

#### `createMockCategoryCount(categoryId, count)`
Создает данные для подсчета товаров в категории.

#### `clearAllMocks()`
Очищает все моки между тестами.

## Паттерны тестирования

### 1. Мокирование зависимостей
```typescript
vi.mock('@qco/db/client', () => ({
  db: {
    query: {
      categories: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}))
```

### 2. Подготовка тестовых данных
```typescript
const mockCategories = [
  createMockCategory({ id: 'cat-1', name: 'Category 1' }),
  createMockCategory({ id: 'cat-2', name: 'Category 2' }),
]
```

### 3. Мокирование вызовов базы данных
```typescript
const { db } = await import('@qco/db/client')
vi.mocked(db.query.categories.findMany).mockResolvedValue(mockCategories)
```

### 4. Проверка результатов
```typescript
expect(result).toHaveLength(2)
expect(result[0]).toEqual({
  id: 'cat-1',
  name: 'Category 1',
  // ... другие поля
})
```

### 5. Проверка вызовов
```typescript
expect(db.query.categories.findMany).toHaveBeenCalledWith({
  where: { column: expect.any(Object), value: true },
})
```

## Типы тестов

### Unit Tests
Тестируют отдельные функции в изоляции:
- `get-all.test.ts`
- `get-by-slug.test.ts`
- `get-root.test.ts`
- и другие

### Integration Tests
Тестируют взаимодействие между компонентами:
- `integration.test.ts`

### Router Tests
Тестируют структуру и экспорты роутера:
- `index.test.ts`

## Покрытие тестами

Каждый файл тестируется по следующим аспектам:

### ✅ Happy Path
- Успешное выполнение с корректными данными
- Правильная обработка результатов
- Корректные вызовы базы данных

### ✅ Edge Cases
- Пустые массивы данных
- Null/undefined значения
- Отсутствующие записи

### ✅ Error Handling
- Ошибки базы данных
- Некорректные входные данные
- TRPC ошибки

### ✅ Data Validation
- Корректность структуры ответов
- Правильность маппинга полей
- Сортировка и фильтрация

## Лучшие практики

### 1. Изоляция тестов
- Каждый тест независим
- Используйте `beforeEach` для очистки моков
- Не полагайтесь на состояние других тестов

### 2. Описательные имена
```typescript
it('should return categories with products and their children', async () => {
  // тест
})
```

### 3. Arrange-Act-Assert
```typescript
// Arrange - подготовка данных
const mockCategories = [createMockCategory()]

// Act - выполнение действия
const result = await getAll.query()

// Assert - проверка результата
expect(result).toHaveLength(1)
```

### 4. Мокирование на правильном уровне
- Мокайте внешние зависимости, а не внутреннюю логику
- Используйте реалистичные тестовые данные

### 5. Проверка вызовов
- Проверяйте, что функции вызываются с правильными параметрами
- Убедитесь, что функции вызываются нужное количество раз

## Отладка тестов

### Включение логов
```typescript
// Временно включить логи в тесте
console.log('Debug info:', result)
```

### Запуск одного теста
```bash
bun test categories/get-all.test.ts -t "should return all categories"
```

### Просмотр покрытия
```bash
bun test:coverage
# Откройте coverage/index.html в браузере
```

## Добавление новых тестов

### 1. Создайте файл теста
```typescript
// test/categories/new-function.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { newFunction } from '../../src/router/categories/new-function'

describe('newFunction', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  it('should work correctly', async () => {
    // ваш тест
  })
})
```

### 2. Добавьте моки в setup.ts (если нужно)
```typescript
vi.mock('new-dependency', () => ({
  newFunction: vi.fn(),
}))
```

### 3. Создайте вспомогательные функции (если нужно)
```typescript
// test/utils/test-helpers.ts
export const createMockNewData = () => ({
  // тестовые данные
})
```

## CI/CD

Тесты автоматически запускаются в CI/CD пайплайне:

```yaml
- name: Run tests
  run: bun test:run

- name: Check coverage
  run: bun test:coverage
```

## Мониторинг качества

### Метрики покрытия
- **Statements**: 95%+
- **Branches**: 90%+
- **Functions**: 95%+
- **Lines**: 95%+

### Линтинг
```bash
bun lint
```

### Type Checking
```bash
bun typecheck
```

## Полезные команды

```bash
# Запуск всех тестов
bun test

# Запуск тестов с покрытием
bun test:coverage

# Запуск тестов в watch режиме
bun test --watch

# Запуск конкретного теста
bun test categories/get-all.test.ts

# Запуск тестов с UI
bun test --ui

# Запуск тестов с подробным выводом
bun test --reporter=verbose
```

## Troubleshooting

### Проблемы с моками
```typescript
// Убедитесь, что мок создан до импорта
vi.mock('@qco/db/client')
const { db } = await import('@qco/db/client')
```

### Проблемы с типами
```typescript
// Используйте правильные типы для моков
vi.mocked(db.query.categories.findMany).mockResolvedValue(mockCategories)
```

### Проблемы с асинхронностью
```typescript
// Всегда используйте async/await в тестах
it('should work', async () => {
  const result = await functionUnderTest()
  expect(result).toBeDefined()
})
``` 