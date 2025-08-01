import { vi } from 'vitest'

// Устанавливаем переменные окружения для тестов
process.env.NODE_ENV = 'test'
process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.APP_URL = 'http://localhost:3000'
process.env.WEB_APP_URL = 'http://localhost:3001'
process.env.EMAIL_FROM = 'test@example.com'

// S3/Storage переменные
process.env.STORAGE_ENDPOINT_URL = 'http://localhost:9000'
process.env.STORAGE_ACCESS_KEY_ID = 'test-access-key'
process.env.STORAGE_SECRET_ACCESS_KEY = 'test-secret-key'
process.env.STORAGE_BUCKET_NAME = 'test-bucket'
process.env.STORAGE_REGION = 'us-east-1'
process.env.STORAGE_CDN_URL = 'http://localhost:9000'

// Better Auth переменные
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-auth'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'

// Resend API ключ
process.env.RESEND_API_KEY = 'test-resend-api-key'

// Vercel переменные
process.env.VERCEL_URL = 'http://localhost:3000'
process.env.VERCEL_ENV = 'test'

// Порт
process.env.PORT = '3000'

// NextAuth переменные (для совместимости)
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Дополнительные переменные для Vercel preset
process.env.DATABASE_URL = process.env.POSTGRES_URL
process.env.DIRECT_URL = process.env.POSTGRES_URL

// Моки для базы данных
const createDbMock = () => ({
    delete: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 'test-id' }])
        })
    }),
    select: vi.fn().mockReturnValue({
        from: vi.fn().mockResolvedValue([{ maxNumber: '0' }])
    }),
    update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
                returning: vi.fn().mockResolvedValue([{ id: 'test-id' }])
            })
        })
    }),
    transaction: vi.fn().mockImplementation(async (callback) => {
        return await callback({
            delete: vi.fn().mockResolvedValue([]),
            insert: vi.fn().mockReturnValue({
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([{ id: 'test-id' }])
                })
            }),
            select: vi.fn().mockReturnValue({
                from: vi.fn().mockResolvedValue([{ maxNumber: '0' }])
            }),
            update: vi.fn().mockReturnValue({
                set: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        returning: vi.fn().mockResolvedValue([{ id: 'test-id' }])
                    })
                })
            }),
            query: {
                customers: {
                    findFirst: vi.fn().mockResolvedValue({
                        id: 'test-customer-id',
                        firstName: 'Старое',
                        lastName: 'Имя',
                        phone: '+7 (999) 000-00-00',
                        name: 'ООО Тестовая Компания',
                        isGuest: false,
                        updatedAt: new Date()
                    }),
                    findMany: vi.fn().mockResolvedValue([])
                },
                customerAddresses: {
                    findFirst: vi.fn().mockResolvedValue({
                        addressLine1: "ул. Пушкина, д. 10",
                        addressLine2: "кв. 5",
                        city: "Москва",
                        isDefault: true,
                    }),
                    findMany: vi.fn().mockResolvedValue([])
                },
                orders: {
                    findFirst: vi.fn().mockResolvedValue(null),
                    findMany: vi.fn().mockResolvedValue([])
                },
                orderItems: {
                    findFirst: vi.fn().mockResolvedValue(null),
                    findMany: vi.fn().mockResolvedValue([])
                }
            }
        })
    }),
    query: {
        customers: {
            findFirst: vi.fn().mockResolvedValue({
                id: 'test-customer-id',
                firstName: 'Старое',
                lastName: 'Имя',
                phone: '+7 (999) 000-00-00',
                name: 'ООО Тестовая Компания',
                isGuest: false,
                updatedAt: new Date()
            }),
            findMany: vi.fn().mockResolvedValue([])
        },
        customerAddresses: {
            findFirst: vi.fn().mockResolvedValue({
                addressLine1: "ул. Пушкина, д. 10",
                addressLine2: "кв. 5",
                city: "Москва",
                isDefault: true,
            }),
            findMany: vi.fn().mockResolvedValue([])
        },
        orders: {
            findFirst: vi.fn().mockResolvedValue(null),
            findMany: vi.fn().mockResolvedValue([])
        },
        orderItems: {
            findFirst: vi.fn().mockResolvedValue(null),
            findMany: vi.fn().mockResolvedValue([])
        }
    }
})

vi.mock('@qco/db/client', () => ({
    db: createDbMock()
}))

vi.mock('@qco/db/client-ws', () => ({
    db: createDbMock()
}))

// Глобальные настройки для тестов
global.console = {
    ...console,
    // Отключаем логи в тестах для чистоты вывода
    //log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
} 