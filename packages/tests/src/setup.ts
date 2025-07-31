import { vi } from 'vitest'

// Устанавливаем переменные окружения для тестов
process.env.NODE_ENV = 'test'
process.env.POSTGRES_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.APP_URL = 'http://localhost:3000'
process.env.WEB_APP_URL = 'http://localhost:3001'
process.env.EMAIL_FROM = 'test@example.com'

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