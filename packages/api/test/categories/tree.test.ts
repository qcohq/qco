import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.tree - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение дерева категорий", () => {
        it("должна успешно получить дерево категорий", async () => {
            const mockCategories = [
                TestUtils.createCategory({ id: "cat-1", name: "Parent 1", parentId: null, productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-2", name: "Child 1", parentId: "cat-1", productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-3", name: "Child 2", parentId: "cat-1", productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-4", name: "Parent 2", parentId: null, productTypeIds: [] }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(mockCategories)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {}

            const caller = helper.getCaller()
            const result = await caller.categories.tree(input)

            expect(result).toHaveLength(2) // 2 корневые категории
            expect(result[0].name).toBe("Parent 1")
            expect(result[0].children).toHaveLength(2) // 2 дочерние категории
            expect(result[1].name).toBe("Parent 2")
            expect(result[1].children).toHaveLength(0) // нет дочерних
        })

        it("должна фильтровать по активным категориям", async () => {
            const mockCategories = [
                TestUtils.createCategory({ id: "cat-1", name: "Active Parent", parentId: null, isActive: true, productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-3", name: "Active Child", parentId: "cat-1", isActive: true, productTypeIds: [] }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(mockCategories)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                isActive: true,
            }

            const caller = helper.getCaller()
            const result = await caller.categories.tree(input)

            expect(result).toHaveLength(1) // только активная корневая категория
            expect(result[0].name).toBe("Active Parent")
            expect(result[0].children).toHaveLength(1) // активная дочерняя
        })

        it("должна обрабатывать пустой список категорий", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {}

            const caller = helper.getCaller()
            const result = await caller.categories.tree(input)

            expect(result).toHaveLength(0)
        })

        it("должна правильно сортировать категории", async () => {
            const mockCategories = [
                TestUtils.createCategory({ id: "cat-2", name: "A Category", parentId: null, sortOrder: 1, productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-1", name: "B Category", parentId: null, sortOrder: 2, productTypeIds: [] }),
                TestUtils.createCategory({ id: "cat-3", name: "C Category", parentId: null, sortOrder: 3, productTypeIds: [] }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(mockCategories)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {}

            const caller = helper.getCaller()
            const result = await caller.categories.tree(input)

            expect(result).toHaveLength(3)
            expect(result[0].name).toBe("A Category") // sortOrder: 1
            expect(result[1].name).toBe("B Category") // sortOrder: 2
            expect(result[2].name).toBe("C Category") // sortOrder: 3
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {}

            const caller = helper.getCaller()

            await expect(caller.categories.tree(input)).rejects.toThrow()
        })
    })
}) 