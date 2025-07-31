import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.getFolderView - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение папочного представления категорий", () => {
        it("должна обрабатывать пустой список категорий", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: true,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getFolderView(input)

            expect(result).toHaveLength(0)
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки при получении категорий", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: true,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()

            await expect(caller.categories.getFolderView(input)).rejects.toThrow()
        })
    })
}) 