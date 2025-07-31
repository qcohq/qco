import { vi } from 'vitest'
import type { Mock } from 'vitest'

// Типы для моков
export type MockedFunction<T extends (...args: any) => any> = Mock<
    Parameters<T>,
    ReturnType<T>
>

// Создание мока для tRPC контекста
export const createMockContext = () => ({
    session: {
        user: {
            id: 'test-user-id',
            email: 'test@example.com',
        },
    },
    db: {
        query: {
            categories: {
                findMany: vi.fn(),
                findFirst: vi.fn(),
            },
            files: {
                findFirst: vi.fn(),
            },
        },
        select: vi.fn(() => ({
            from: vi.fn(() => ({
                where: vi.fn(() => ({
                    groupBy: vi.fn(),
                })),
            })),
        })),
        insert: vi.fn(() => ({
            values: vi.fn(() => ({
                returning: vi.fn(),
            })),
        })),
        update: vi.fn(() => ({
            set: vi.fn(() => ({
                where: vi.fn(() => ({
                    returning: vi.fn(),
                })),
            })),
        })),
        delete: vi.fn(() => ({
            where: vi.fn(() => ({
                returning: vi.fn(),
            })),
        })),
    },
    token: 'test-token',
})

// Создание тестовых данных категорий
export const createMockCategory = (overrides: Partial<any> = {}) => ({
    id: 'test-category-id',
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test category description',
    imageUrl: null,
    parentId: null,
    productsCount: 0,
    sortOrder: 1,
    isActive: true,
    isFeatured: false,
    image: null,
    metaTitle: null,
    metaDescription: null,
    metaKeywords: null,
    xmlId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
})

// Создание тестовых данных файлов
export const createMockFile = (overrides: Partial<any> = {}) => ({
    id: 'test-file-id',
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    path: 'uploads/categories/test-image.jpg',
    type: 'category_image',
    uploadedBy: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
})

// Создание тестовых данных для подсчета товаров
export const createMockCategoryCount = (categoryId: string, count: number) => ({
    categoryId,
    count,
})

// Создание мока для publicProcedure
export const createMockProcedure = () => ({
    input: vi.fn().mockReturnThis(),
    output: vi.fn().mockReturnThis(),
    query: vi.fn(),
    mutation: vi.fn(),
})

// Создание тестовых данных для пагинации
export const createMockPaginationMeta = (overrides: Partial<any> = {}) => ({
    total: 100,
    page: 1,
    limit: 12,
    pageCount: 9,
    ...overrides,
})

// Создание тестовых данных для списка категорий
export const createMockCategoriesList = (count = 5) => ({
    items: Array.from({ length: count }, (_, i) =>
        createMockCategory({
            id: `category-${i + 1}`,
            name: `Category ${i + 1}`,
            slug: `category-${i + 1}`,
        })
    ),
    meta: createMockPaginationMeta(),
})

// Создание тестовых данных для иерархии категорий
export const createMockCategoryHierarchy = () => [
    { id: 'root-1', name: 'Root Category 1', slug: 'root-category-1' },
    { id: 'child-1', name: 'Child Category 1', slug: 'child-category-1' },
    { id: 'grandchild-1', name: 'Grandchild Category 1', slug: 'grandchild-category-1' },
]

// Создание тестовых данных для дерева категорий
export const createMockCategoryTree = () => [
    {
        id: 'root-1',
        name: 'Root Category 1',
        slug: 'root-category-1',
        description: 'Root category description',
        imageUrl: null,
        productsCount: 5,
        order: 1,
        isActive: true,
        children: [
            {
                id: 'child-1',
                name: 'Child Category 1',
                slug: 'child-category-1',
                description: 'Child category description',
                imageUrl: null,
                productsCount: 3,
                order: 1,
                isActive: true,
                children: [],
            },
        ],
    },
]

// Создание тестовых данных для создания категории
export const createMockCreateCategoryInput = (overrides: Partial<any> = {}) => ({
    name: 'New Category',
    slug: 'new-category',
    description: 'New category description',
    isActive: true,
    isFeatured: false,
    sortOrder: 1,
    parentId: null,
    image: {
        key: 'uploads/categories/new-image.jpg',
        name: 'new-image.jpg',
        mimeType: 'image/jpeg',
        size: 2048,
    },
    ...overrides,
})

// Создание тестовых данных для обновления категории
export const createMockUpdateCategoryInput = (overrides: Partial<any> = {}) => ({
    id: 'test-category-id',
    name: 'Updated Category',
    slug: 'updated-category',
    description: 'Updated category description',
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    parentId: null,
    ...overrides,
})

// Вспомогательная функция для очистки моков
export const clearAllMocks = () => {
    vi.clearAllMocks()
}

// Вспомогательная функция для проверки вызова мока
export const expectMockToHaveBeenCalledWith = (
    mock: MockedFunction<any>,
    expectedArgs: any[]
) => {
    expect(mock).toHaveBeenCalledWith(...expectedArgs)
}

// Вспомогательная функция для создания мока базы данных
export const createMockDb = () => ({
    query: {
        categories: {
            findMany: vi.fn(),
            findFirst: vi.fn(),
        },
        files: {
            findFirst: vi.fn(),
        },
    },
    select: vi.fn(() => ({
        from: vi.fn(() => ({
            where: vi.fn(() => ({
                groupBy: vi.fn(),
            })),
        })),
    })),
    insert: vi.fn(() => ({
        values: vi.fn(() => ({
            returning: vi.fn(),
        })),
    })),
    update: vi.fn(() => ({
        set: vi.fn(() => ({
            where: vi.fn(() => ({
                returning: vi.fn(),
            })),
        })),
    })),
    delete: vi.fn(() => ({
        where: vi.fn(() => ({
            returning: vi.fn(),
        })),
    })),
})

// Вспомогательная функция для создания мока сессии
export const createMockSession = (overrides: Partial<any> = {}) => ({
    user: {
        id: 'test-user-id',
        email: 'test@example.com',
    },
    ...overrides,
})

// Вспомогательная функция для создания мока TRPCError
export const createMockTRPCError = (code: string, message: string) => {
    const error = new Error(message) as any
    error.name = 'TRPCError'
    error.code = code
    return error
} 