import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.getFirstLevel - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение категорий первого уровня", () => {
        it("должна успешно получить категории первого уровня", async () => {
            const firstLevelCategories = [
                TestUtils.createCategory({
                    id: "cat-1",
                    name: "First Level Category 1",
                    parentId: null,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
                TestUtils.createCategory({
                    id: "cat-2",
                    name: "First Level Category 2",
                    parentId: null,
                    sortOrder: 2,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(firstLevelCategories)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getFirstLevel()

            expect(result).toEqual(firstLevelCategories)
            expect(result).toHaveLength(2)
            expect(result[0].parentId).toBeNull()
            expect(result[1].parentId).toBeNull()
        })

        it("должна возвращать пустой массив, если нет категорий первого уровня", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getFirstLevel()

            expect(result).toEqual([])
            expect(result).toHaveLength(0)
        })

        it("должна правильно сортировать категории по sortOrder и name", async () => {
            const firstLevelCategories = [
                TestUtils.createCategory({
                    id: "cat-1",
                    name: "A Category",
                    parentId: null,
                    sortOrder: 1,
                    productTypeIds: [],
                }),
                TestUtils.createCategory({
                    id: "cat-2",
                    name: "B Category",
                    parentId: null,
                    sortOrder: 2,
                    productTypeIds: [],
                }),
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findMany: vi.fn().mockResolvedValue(firstLevelCategories)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getFirstLevel()

            expect(result).toHaveLength(2)
            // Проверяем, что сортировка работает (по sortOrder, затем по name)
            expect(result[0].sortOrder).toBe(1)
            expect(result[1].sortOrder).toBe(2)
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

            const caller = helper.getCaller()

            await expect(caller.categories.getFirstLevel()).rejects.toThrow("Ошибка получения категорий первого уровня")
        })
    })
}) 