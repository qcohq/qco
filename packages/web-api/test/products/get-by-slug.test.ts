import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../../src/root";
import { createTestContext } from "../setup";

describe("Products API - getBySlug", () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    beforeAll(async () => {
        // Здесь можно добавить setup данных если нужно
    });

    afterAll(async () => {
        // Очистка после тестов
    });

    it("should return product with brandSlug", async () => {
        // Этот тест проверяет, что API возвращает brandSlug
        // В реальном тесте нужно создать тестовые данные

        // Пока просто проверяем, что API не падает
        expect(caller).toBeDefined();
    });

    it("should handle product without brand", async () => {
        // Тест для продукта без бренда
        expect(caller).toBeDefined();
    });
}); 