// Реэкспортируем общий setup из @qco/tests
export * from '@qco/tests'

// Создаем тестовый контекст для tRPC
export function createTestContext() {
    return {
        db: {} as any, // Используем мок из setup
    };
} 