# Супер инфраструктура для тестирования API

## Обзор

Эта инфраструктура предоставляет мощные инструменты для тестирования tRPC API с полной типизацией, моками и утилитами.

## Основные компоненты

### 1. TRPCTestHelper
Основной класс для создания и управления tRPC caller с моками.

```typescript
import { TRPCTestHelper } from "./utils/test-infrastructure"

describe("API Tests", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    it("should work", async () => {
        const caller = helper.getCaller()
        const result = await caller.categories.create(input)
        expect(result).toBeDefined()
    })
})
```

### 2. TestDataFactory
Фабрика для создания тестовых данных с правильной структурой.

```typescript
import { TestDataFactory } from "./utils/test-infrastructure"

// Создание пользователя
const user = TestDataFactory.createUser({
    role: "admin",
    email: "admin@example.com"
})

// Создание контекста
const context = TestDataFactory.createTestContext({
    session: { user }
})
```

### 3. TestUtils
Утилиты для создания тестовых сущностей.

```typescript
import { TestUtils } from "./utils/test-infrastructure"

const category = TestUtils.createCategory({
    name: "Test Category",
    slug: "test-category"
})

const file = TestUtils.createFile({
    name: "test-image.jpg",
    type: "category_image"
})

const product = TestUtils.createProduct({
    name: "Test Product",
    price: 1000
})
```

### 4. ErrorAssertions
Хелперы для проверки ошибок tRPC.

```typescript
import { ErrorAssertions } from "./utils/test-infrastructure"

// Проверка различных типов ошибок
await ErrorAssertions.expectTRPCError(
    caller.categories.create(invalidInput),
    "BAD_REQUEST"
)

await ErrorAssertions.expectUnauthorizedError(
    caller.categories.create(input)
)

await ErrorAssertions.expectInternalServerError(
    caller.categories.create(input),
    "Не удалось создать категорию"
)
```

### 5. DbMockHelpers
Хелперы для моков базы данных.

```typescript
import { DbMockHelpers } from "./utils/test-infrastructure"

// Мок insert
const mockInsert = DbMockHelpers.mockInsertReturn(data)
db.insert.mockReturnValue(mockInsert)

// Мок select
const mockSelect = DbMockHelpers.mockSelectReturn(data)
db.select.mockReturnValue(mockSelect)
```

## Примеры использования

### Базовый тест создания категории

```typescript
describe("categories.create", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    it("создаёт категорию без изображения", async () => {
        // Подготовка
        const input = {
            name: "Test Category",
            slug: "test-category",
            description: "Test description",
            isActive: true,
            isFeatured: false,
            sortOrder: 1,
            parentId: null,
        }

        const expectedCategory = TestUtils.createCategory({
            ...input,
            id: "cat-1",
        })

        helper.mockInsert(expectedCategory)

        // Действие
        const caller = helper.getCaller()
        const result = await caller.categories.create(input)

        // Проверки
        expect(result).toEqual(expectedCategory)
        helper.expectInsertCalled(1)
    })
})
```

### Тест с изображением

```typescript
it("создаёт категорию с изображением", async () => {
    const input = {
        name: "Test Category",
        slug: "test-category",
        image: {
            key: "uploads/categories/test-image.jpg",
            name: "test-image.jpg",
            mimeType: "image/jpeg",
            size: 2048,
        }
    }

    const mockFile = TestUtils.createFile({
        id: "file-1",
        name: input.image!.name,
        uploadedBy: helper.getUser().id,
    })

    const expectedCategory = TestUtils.createCategory({
        ...input,
        id: "cat-1",
        imageId: mockFile.id,
    })

    // Мокаем последовательные вызовы
    const mockFileInsert = helper.mockInsert(mockFile)
    const mockCategoryInsert = helper.mockInsert(expectedCategory)

    const caller = helper.getCaller()
    const result = await caller.categories.create(input)

    expect(result).toEqual(expectedCategory)
    helper.expectInsertCalled(2) // файл + категория

    // Проверяем вызовы
    expect(mockFileInsert.values).toHaveBeenCalledWith({
        name: input.image!.name,
        mimeType: input.image!.mimeType,
        size: input.image!.size,
        path: "uploads/categories/test-image.jpg",
        type: "category_image",
        uploadedBy: helper.getUser().id,
    })
})
```

### Тест обработки ошибок

```typescript
it("выбрасывает ошибку при неудачном создании", async () => {
    const input = {
        name: "Test Category",
        slug: "test-category",
    }

    // Мокаем неудачное создание (пустой массив)
    helper.mockInsert([])

    const caller = helper.getCaller()
    await ErrorAssertions.expectInternalServerError(
        caller.categories.create(input),
        "Не удалось создать категорию"
    )
})
```

### Тест с разными пользователями

```typescript
it("работает с разными ролями пользователей", async () => {
    // Создаем helper с пользователем-админом
    const adminHelper = new TRPCTestHelper({
        session: {
            user: {
                id: "admin-1",
                email: "admin@example.com",
                name: "Admin User",
                emailVerified: true,
                role: "admin",
                banned: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        }
    })

    const input = {
        name: "Admin Category",
        slug: "admin-category",
    }

    const expectedCategory = TestUtils.createCategory({
        ...input,
        id: "cat-admin-1",
    })

    adminHelper.mockInsert(expectedCategory)

    const caller = adminHelper.getCaller()
    const result = await caller.categories.create(input)

    expect(result).toEqual(expectedCategory)
    expect(adminHelper.getUser().role).toBe("admin")
})
```

## Преимущества инфраструктуры

### ✅ Типобезопасность
- Полная типизация всех компонентов
- Автодополнение в IDE
- Проверка типов на этапе компиляции

### ✅ Переиспользование
- Единые фабрики для тестовых данных
- Общие хелперы для моков
- Стандартизированные проверки ошибок

### ✅ Читаемость
- Понятная структура тестов
- Описательные названия методов
- Минимум boilerplate кода

### ✅ Поддержка
- Легко добавлять новые утилиты
- Простое расширение для новых сущностей
- Централизованное управление моками

### ✅ Производительность
- Быстрые тесты без внешних зависимостей
- Эффективные моки
- Минимальное время выполнения

## Структура файлов

```
test/
├── utils/
│   └── test-infrastructure.ts    # Основная инфраструктура
├── categories/
│   ├── create.test.ts            # Тесты создания категорий (5 тестов)
│   ├── create-examples.test.ts   # Примеры использования (2 теста)
│   ├── list.test.ts              # Тесты списка категорий (5 тестов)
│   ├── get-by-id.test.ts         # Тесты получения по ID (5 тестов)
│   ├── update.test.ts            # Тесты обновления (6 тестов)
│   ├── delete.test.ts            # Тесты удаления (5 тестов)
│   ├── tree.test.ts              # Тесты дерева категорий (4 теста)
│   ├── check-slug.test.ts        # Тесты проверки slug (6 тестов)
│   └── index.test.ts             # Общий файл для всех тестов
└── README.md                     # Документация
```

## Запуск тестов

```bash
# Запуск всех тестов
bun test

# Запуск всех тестов категорий
bun test test/categories/

# Запуск конкретного теста
bun test test/categories/create.test.ts
bun test test/categories/list.test.ts
bun test test/categories/update.test.ts
bun test test/categories/delete.test.ts
bun test test/categories/tree.test.ts
bun test test/categories/check-slug.test.ts

# Запуск с покрытием
bun test --coverage

# Запуск тестов с подробным выводом
bun test test/categories/ --reporter=verbose
```

## Покрытие тестами Categories API

### ✅ Реализованные тесты:

#### **create.test.ts** (5 тестов)
- ✅ Создание категории без изображения
- ✅ Установка значений по умолчанию
- ✅ Создание категории с изображением
- ✅ Обработка ошибок при создании файла
- ✅ Обработка ошибок при создании категории

#### **list.test.ts** (5 тестов)
- ✅ Получение списка категорий
- ✅ Поиск по названию
- ✅ Пагинация
- ✅ Категории с изображениями
- ✅ Обработка ошибок базы данных

#### **get-by-id.test.ts** (5 тестов)
- ✅ Получение категории по ID
- ✅ Категория с изображением
- ✅ Категория без изображения
- ✅ Несуществующее изображение
- ✅ Обработка ошибок

#### **update.test.ts** (6 тестов)
- ✅ Обновление без изображения
- ✅ Обновление частичных полей
- ✅ Обновление с новым изображением
- ✅ Сохранение существующего изображения
- ✅ Обработка ошибок создания файла
- ✅ Обработка ошибок обновления

#### **delete.test.ts** (5 тестов)
- ✅ Удаление без изображения
- ✅ Удаление с изображением
- ✅ Несуществующее изображение
- ✅ Несуществующая категория
- ✅ Обработка ошибок

#### **tree.test.ts** (4 теста)
- ✅ Получение дерева категорий
- ✅ Фильтрация по активным
- ✅ Пустой список
- ✅ Правильная сортировка

#### **check-slug.test.ts** (6 тестов)
- ✅ Доступный slug
- ✅ Занятый slug
- ✅ Исключение текущей категории
- ✅ Конфликт при обновлении
- ✅ Пустой slug
- ✅ Специальные символы

### 📊 **Общая статистика:**
- **38 тестов** для всех основных методов
- **100% покрытие** основных сценариев
- **Обработка ошибок** для всех методов
- **Реальные вызовы tRPC API**

## Расширение инфраструктуры

### Добавление новой сущности

```typescript
// В TestUtils
static createBrand(overrides: any = {}) {
    return {
        id: "brand-1",
        name: "Test Brand",
        slug: "test-brand",
        description: "Test brand description",
        logoId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    }
}
```

### Добавление нового типа ошибки

```typescript
// В ErrorAssertions
static expectForbiddenError(promise: Promise<any>) {
    return expect(promise).rejects.toMatchObject({
        code: "FORBIDDEN",
    })
}
```

### Добавление нового мока

```typescript
// В DbMockHelpers
static mockTransaction(data: any) {
    return {
        commit: vi.fn().mockResolvedValue(data),
        rollback: vi.fn().mockResolvedValue(undefined),
    }
}
```

Эта инфраструктура делает тестирование API простым, надежным и масштабируемым!
