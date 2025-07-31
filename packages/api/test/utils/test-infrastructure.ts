import { vi, expect } from "vitest"
import { appRouter } from "../../src/root"
import { createCallerFactory } from "../../src/trpc"

// Глобальные моки
vi.mock("../../src/lib/resolve-file-id-or-path", () => ({
    resolveFileIdOrPath: vi.fn().mockImplementation(async ({ fileIdOrPath }) => {
        // Возвращаем ID файла на основе пути
        if (fileIdOrPath.includes("logo")) return "file-1"
        if (fileIdOrPath.includes("banner")) return "file-2"
        return "file-3"
    })
}))

vi.mock("@qco/lib", () => ({
    deleteFile: vi.fn().mockResolvedValue(undefined),
    getFileUrl: vi.fn().mockImplementation((path: string) => `https://example.com/${path}`)
}))

// Типы для тестовой инфраструктуры
export interface TestUser {
    id: string
    email: string
    name: string
    emailVerified: boolean
    role: string
    banned: boolean
    createdAt: Date
    updatedAt: Date
    image?: string | null
    banReason?: string | null
    banExpires?: Date | null
}

export interface TestSession {
    id: string
    token: string
    userId: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
}

export interface TestContext {
    session: {
        session: TestSession
        user: TestUser
    }
    db: any
    token: string
}

export interface MockDb {
    insert: ReturnType<typeof vi.fn>
    select: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
    query: {
        brands?: {
            findFirst?: ReturnType<typeof vi.fn>
            findMany?: ReturnType<typeof vi.fn>
        }
        brandFiles?: {
            findFirst?: ReturnType<typeof vi.fn>
            findMany?: ReturnType<typeof vi.fn>
        }
        files?: {
            findFirst?: ReturnType<typeof vi.fn>
            findMany?: ReturnType<typeof vi.fn>
        }
        categories?: {
            findFirst?: ReturnType<typeof vi.fn>
            findMany?: ReturnType<typeof vi.fn>
        }
        [key: string]: any
    }
}

// Фабрики для создания тестовых данных
export class TestDataFactory {
    static createUser(overrides: Partial<TestUser> = {}): TestUser {
        return {
            id: "user-1",
            email: "test@example.com",
            name: "Test User",
            emailVerified: true,
            role: "admin",
            banned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createSession(overrides: Partial<TestSession> = {}): TestSession {
        return {
            id: "sess-1",
            token: "test-token",
            userId: "user-1",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60), // +1 час
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createMockDb(): MockDb {
        return {
            insert: vi.fn(),
            select: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            query: {
                brands: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
                brandFiles: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
                files: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
                categories: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
                categoryProductTypes: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
                productTypes: {
                    findFirst: vi.fn(),
                    findMany: vi.fn(),
                },
            },
        }
    }

    static createTestContext(overrides: Partial<TestContext> = {}): TestContext {
        const user = TestDataFactory.createUser(overrides.session?.user)
        const session = TestDataFactory.createSession({ userId: user.id, ...overrides.session?.session })
        const db = TestDataFactory.createMockDb()

        return {
            session: {
                session,
                user,
            },
            db,
            token: "test-token",
            ...overrides,
        }
    }
}

// Хелперы для моков базы данных
export class DbMockHelpers {
    static mockInsertReturn(data: any) {
        return {
            values: vi.fn().mockReturnThis(),
            returning: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
        }
    }

    static mockSelectReturn(data: any) {
        return {
            from: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockReturnThis(),
            then: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
        }
    }

    static mockUpdateReturn(data: any) {
        return {
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockReturnThis(),
            returning: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
        }
    }

    static mockDeleteReturn(data: any) {
        return {
            where: vi.fn().mockReturnThis(),
            returning: vi.fn().mockResolvedValue(Array.isArray(data) ? data : [data]),
        }
    }
}

// Основной класс для создания tRPC caller
export class TRPCTestHelper {
    private caller: any
    private context: TestContext

    constructor(context?: Partial<TestContext>) {
        this.context = TestDataFactory.createTestContext(context)
        this.createCaller()
    }

    private createCaller() {
        const createCaller = createCallerFactory(appRouter)
        this.caller = createCaller(this.context)
    }

    getCaller() {
        return this.caller
    }

    getContext() {
        return this.context
    }

    getDb() {
        return this.context.db
    }

    getUser() {
        return this.context.session.user
    }

    getSession() {
        return this.context.session.session
    }

    // Методы для настройки моков
    mockInsert(data: any) {
        const mockReturn = DbMockHelpers.mockInsertReturn(data)
        this.context.db.insert.mockReturnValue(mockReturn)
        return mockReturn
    }

    mockSelect(data: any) {
        const mockReturn = DbMockHelpers.mockSelectReturn(data)
        this.context.db.select.mockReturnValue(mockReturn)
        return mockReturn
    }

    mockUpdate(data: any) {
        const mockReturn = DbMockHelpers.mockUpdateReturn(data)
        this.context.db.update.mockReturnValue(mockReturn)
        return mockReturn
    }

    mockDelete(data: any) {
        const mockReturn = DbMockHelpers.mockDeleteReturn(data)
        this.context.db.delete.mockReturnValue(mockReturn)
        return mockReturn
    }

    // Методы для проверки вызовов
    expectInsertCalled(times = 1) {
        expect(this.context.db.insert).toHaveBeenCalledTimes(times)
    }

    expectSelectCalled(times = 1) {
        expect(this.context.db.select).toHaveBeenCalledTimes(times)
    }

    expectUpdateCalled(times = 1) {
        expect(this.context.db.update).toHaveBeenCalledTimes(times)
    }

    expectDeleteCalled(times = 1) {
        expect(this.context.db.delete).toHaveBeenCalledTimes(times)
    }

    // Методы для очистки моков
    clearMocks() {
        vi.clearAllMocks()
    }

    resetMocks() {
        vi.resetAllMocks()
    }
}

// Утилиты для создания тестовых данных
export class TestUtils {
    static createCategory(overrides: any = {}) {
        return {
            id: "cat-1",
            name: "Test Category",
            slug: "test-category",
            description: "Test description",
            imageId: null,
            isActive: true,
            isFeatured: false,
            sortOrder: 1,
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createFile(overrides: any = {}) {
        return {
            id: "file-1",
            name: "test-image.jpg",
            mimeType: "image/jpeg",
            size: 2048,
            path: "uploads/categories/test-image.jpg",
            type: "category_image",
            uploadedBy: "user-1",
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createProduct(overrides: any = {}) {
        return {
            id: "prod-1",
            name: "Test Product",
            slug: "test-product",
            description: "Test product description",
            price: 1000,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createOrder(overrides: any = {}) {
        return {
            id: "order-1",
            customerId: "customer-1",
            status: "pending",
            total: 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createBrand(overrides: any = {}) {
        return {
            id: "brand-1",
            name: "Test Brand",
            slug: "test-brand",
            description: "Test description",
            shortDescription: "Short description",
            website: "https://test.com",
            email: "test@brand.com",
            phone: "+1234567890",
            isActive: true,
            isFeatured: false,
            foundedYear: "2020",
            countryOfOrigin: "USA",
            brandColor: "#FF0000",
            metaTitle: "Test Brand Meta",
            metaDescription: "Test brand meta description",
            metaKeywords: ["test", "brand"],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "user-1",
            updatedBy: "user-1",
            ...overrides,
        }
    }

    static createBrandFile(overrides: any = {}) {
        return {
            id: "bf-1",
            brandId: "brand-1",
            fileId: "file-1",
            type: "logo",
            order: 1,
            createdAt: new Date(),
            ...overrides,
        }
    }

    static createCategoryProductType(overrides: any = {}) {
        return {
            id: "cpt-1",
            categoryId: "cat-1",
            productTypeId: "pt-1",
            isPrimary: false,
            sortOrder: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }

    static createProductType(overrides: any = {}) {
        return {
            id: "pt-1",
            name: "Test Product Type",
            slug: "test-product-type",
            description: "Test product type description",
            createdAt: new Date(),
            updatedAt: new Date(),
            ...overrides,
        }
    }
}

// Хелперы для проверки ошибок
export class ErrorAssertions {
    static expectTRPCError(promise: Promise<any>, code: string, message?: string) {
        return expect(promise).rejects.toMatchObject({
            code,
            ...(message && { message }),
        })
    }

    static expectValidationError(promise: Promise<any>) {
        return expect(promise).rejects.toMatchObject({
            code: "BAD_REQUEST",
        })
    }

    static expectUnauthorizedError(promise: Promise<any>) {
        return expect(promise).rejects.toMatchObject({
            code: "UNAUTHORIZED",
        })
    }

    static expectNotFoundError(promise: Promise<any>) {
        return expect(promise).rejects.toMatchObject({
            code: "NOT_FOUND",
        })
    }

    static expectInternalServerError(promise: Promise<any>, message?: string) {
        return expect(promise).rejects.toMatchObject({
            code: "INTERNAL_SERVER_ERROR",
            ...(message && { message }),
        })
    }
}

// Декораторы для тестов
export function withTRPCTest(setupFn?: (helper: TRPCTestHelper) => void) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value

        descriptor.value = function (...args: any[]) {
            const helper = new TRPCTestHelper()
            if (setupFn) {
                setupFn(helper)
            }
            return originalMethod.apply(this, [helper, ...args])
        }

        return descriptor
    }
}

// Экспорт по умолчанию для удобства
export default {
    TestDataFactory,
    DbMockHelpers,
    TRPCTestHelper,
    TestUtils,
    ErrorAssertions,
    withTRPCTest,
}
