import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.recalculateCounts - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Пересчет количества продуктов", () => {
        it("должна обрабатывать пустой список категорий", async () => {
            const db = helper.getDb()

            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.recalculateCounts()

            expect(result).toEqual({ success: true })

            // Проверяем, что не было вызовов подсчета и обновления
            expect(db.select).not.toHaveBeenCalled()
            expect(db.update).not.toHaveBeenCalled()
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки при получении категорий", async () => {
            const db = helper.getDb()

            const mockCategoriesQuery = {
                findMany: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()

            await expect(caller.categories.recalculateCounts()).rejects.toThrow()
        })
    })
}) 