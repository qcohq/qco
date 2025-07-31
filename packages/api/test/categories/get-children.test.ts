import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.getChildren - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение дочерних категорий", () => {
        it("должна получить дочерние категории для указанного родителя", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: true,
            }

            const childrenCategories = [
                TestUtils.createCategory({
                    id: "child-1",
                    name: "Child Category 1",
                    parentId: "parent-cat-1",
                    isActive: true,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
                TestUtils.createCategory({
                    id: "child-2",
                    name: "Child Category 2",
                    parentId: "parent-cat-1",
                    isActive: true,
                    sortOrder: 2,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(childrenCategories),
                findFirst: vi.fn().mockResolvedValue(null) // нет дочерних элементов
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getChildren(input)

            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({
                id: "child-1",
                name: "Child Category 1",
                slug: expect.any(String),
                description: expect.any(String),
                isActive: true,
                sortOrder: 1,
                parentId: "parent-cat-1",
                children: [],
            })
            expect(result[1]).toEqual({
                id: "child-2",
                name: "Child Category 2",
                slug: expect.any(String),
                description: expect.any(String),
                isActive: true,
                sortOrder: 2,
                parentId: "parent-cat-1",
                children: [],
            })
        })

        it("должна получить корневые категории (без родителя)", async () => {
            const input = {
                parentId: null,
                isActive: undefined,
            }

            const rootCategories = [
                TestUtils.createCategory({
                    id: "root-1",
                    name: "Root Category 1",
                    parentId: null,
                    isActive: true,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(rootCategories),
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getChildren(input)

            expect(result).toHaveLength(1)
            expect(result[0].parentId).toBeNull()
        })

        it("должна фильтровать по активным категориям", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: false,
            }

            const inactiveCategories = [
                TestUtils.createCategory({
                    id: "inactive-1",
                    name: "Inactive Category",
                    parentId: "parent-cat-1",
                    isActive: false,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(inactiveCategories),
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getChildren(input)

            expect(result).toHaveLength(1)
            expect(result[0].isActive).toBe(false)
        })

        it("должна обрабатывать категории с дочерними элементами", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: true,
            }

            const childrenCategories = [
                TestUtils.createCategory({
                    id: "child-1",
                    name: "Child Category 1",
                    parentId: "parent-cat-1",
                    isActive: true,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(childrenCategories),
                findFirst: vi.fn().mockResolvedValue({ id: "grandchild-1" }) // есть дочерние элементы
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getChildren(input)

            expect(result).toHaveLength(1)
            expect(result[0].children).toEqual([])
        })

        it("должна обрабатывать пустой список дочерних категорий", async () => {
            const input = {
                parentId: "parent-cat-1",
                isActive: true,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue([]),
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getChildren(input)

            expect(result).toHaveLength(0)
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
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

            await expect(caller.categories.getChildren(input)).rejects.toThrow()
        })
    })
}) 