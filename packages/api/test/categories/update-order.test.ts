import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.updateCategoryOrder - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Обновление порядка категории", () => {
        it("должна успешно обновить порядок категории", async () => {
            const input = {
                categoryId: "cat-1",
                newOrder: 5,
            }

            const expectedCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                sortOrder: 5,
                productTypeIds: [],
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.updateOrder(input)

            expect(result).toEqual(expectedCategory)
            helper.expectUpdateCalled(1)
        })

        it("должна обновить порядок на 0", async () => {
            const input = {
                categoryId: "cat-1",
                newOrder: 0,
            }

            const expectedCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                sortOrder: 0,
                productTypeIds: [],
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.updateOrder(input)

            expect(result).toEqual(expectedCategory)
            expect(result.sortOrder).toBe(0)
        })

        it("должна обновить порядок на отрицательное значение", async () => {
            const input = {
                categoryId: "cat-1",
                newOrder: -1,
            }

            const expectedCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                sortOrder: -1,
                productTypeIds: [],
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.updateOrder(input)

            expect(result).toEqual(expectedCategory)
            expect(result.sortOrder).toBe(-1)
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
            const input = {
                categoryId: "cat-1",
                newOrder: 5,
            }

            const db = helper.getDb()
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()

            await expect(caller.categories.updateCategoryOrder(input)).rejects.toThrow()
        })

        it("должна обрабатывать несуществующую категорию", async () => {
            const input = {
                categoryId: "non-existent-id",
                newOrder: 5,
            }

            const db = helper.getDb()
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()

            await expect(caller.categories.updateCategoryOrder(input)).rejects.toThrow()
        })
    })
}) 