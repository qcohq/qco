import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.delete - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Обработка ошибок", () => {
        it("должна выбросить ошибку при несуществующей категории", async () => {
            const db = helper.getDb()

            // Мокаем поиск категории (не найдена)
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                id: "non-existent-id",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.delete(input)).rejects.toThrow("Категория с ID non-existent-id не найдена")
        })

        it("должна обрабатывать ошибки базы данных", async () => {
            const db = helper.getDb()

            // Мокаем ошибку при поиске категории
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.delete(input)).rejects.toThrow("Database error")
        })
    })
}) 