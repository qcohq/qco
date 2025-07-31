import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.checkSlug - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Проверка доступности slug", () => {
        it("должна вернуть true для доступного slug", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "new-category",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(true)
            expect(result.existingCategory).toBeNull()
        })

        it("должна вернуть false для занятого slug", async () => {
            const existingCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Existing Category",
                slug: "existing-category",
                productTypeIds: [],
            })

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(existingCategory)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "existing-category",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(false)
            expect(result.existingCategory).toEqual({
                id: "cat-1",
                name: "Existing Category",
                slug: "existing-category",
            })
        })

        it("должна исключать текущую категорию при обновлении", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "my-category",
                excludeId: "cat-1", // исключаем текущую категорию
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(true)
            expect(result.existingCategory).toBeNull()
        })

        it("должна найти конфликт при обновлении с slug другой категории", async () => {
            const existingCategory = TestUtils.createCategory({
                id: "cat-2", // другая категория
                name: "Other Category",
                slug: "other-category",
                productTypeIds: [],
            })

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(existingCategory)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "other-category",
                excludeId: "cat-1", // исключаем текущую категорию
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(false)
            expect(result.existingCategory).toEqual({
                id: "cat-2",
                name: "Other Category",
                slug: "other-category",
            })
        })

        it("должна обрабатывать короткий slug", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "a",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(true)
            expect(result.existingCategory).toBeNull()
        })

        it("должна обрабатывать slug с специальными символами", async () => {
            const existingCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Special Category",
                slug: "special-category-123",
            })

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(existingCategory)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "special-category-123",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.checkSlug(input)

            expect(result.isAvailable).toBe(false)
            expect(result.existingCategory?.slug).toBe("special-category-123")
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const input = {
                slug: "test-category",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.checkSlug(input)).rejects.toThrow("Ошибка при проверке уникальности URL категории")
        })
    })
}) 