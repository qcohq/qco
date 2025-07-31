import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['../../packages/tests/src/setup.ts'],
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