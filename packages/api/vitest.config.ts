import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        silent: false,
        environment: 'node',
        setupFiles: ['../../packages/tests/src/setup.ts'],
        testTimeout: 10000, // Увеличиваем таймаут до 10 секунд
        pool: 'forks', // Используем форки вместо воркеров для лучшей изоляции
        poolOptions: {
            forks: {
                singleFork: true, // Используем один форк для всех тестов
                maxForks: 1, // Ограничиваем количество форков
                isolate: false,

            },
        },
        isolate: false,
        maxConcurrency: 1, // Запускаем тесты последовательно
        env: {
            NODE_ENV: 'test',
            POSTGRES_URL: 'postgresql://test:test@localhost:5432/test_db',
            NEXTAUTH_SECRET: 'test-secret-key',
            NEXTAUTH_URL: 'http://localhost:3000',
            STORAGE_ENDPOINT_URL: 'http://localhost:9000',
            STORAGE_ACCESS_KEY_ID: 'test-access-key',
            STORAGE_SECRET_ACCESS_KEY: 'test-secret-key',
            STORAGE_BUCKET_NAME: 'test-bucket',
            STORAGE_REGION: 'us-east-1',
            APP_URL: 'http://localhost:3000',
            WEB_APP_URL: 'http://localhost:3001',
            EMAIL_FROM: 'test@example.com',
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/coverage/**',
            ],
        },
    },
}) 