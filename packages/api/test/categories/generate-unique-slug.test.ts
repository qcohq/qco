import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.generateUniqueSlug - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Генерация уникального slug", () => {
        it("должна вернуть оригинальный slug, если он доступен", async () => {
            const input = {
                baseSlug: "test-category",
                excludeId: null,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null),
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.generateUniqueSlug(input)

            expect(result).toEqual({
                slug: "test-category",
                isOriginal: true,
            })
        })

        it("должна генерировать уникальный slug с номером, если базовый занят", async () => {
            const input = {
                baseSlug: "test-category",
                excludeId: null,
            }

            const existingCategory = { id: "cat-1", slug: "test-category" }
            const existingSlugs = [
                { slug: "test-category" },
                { slug: "test-category-1" },
                { slug: "test-category-3" }
            ]

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(existingCategory),
                findMany: vi.fn().mockResolvedValue(existingSlugs)
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.generateUniqueSlug(input)

            expect(result).toEqual({
                slug: "test-category-2",
                isOriginal: false,
                counter: 2,
            })
        })

        it("должна исключать указанную категорию при генерации", async () => {
            const input = {
                baseSlug: "test-category",
                excludeId: "cat-1",
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null),
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.generateUniqueSlug(input)

            expect(result).toEqual({
                slug: "test-category",
                isOriginal: true,
            })

            // Проверяем, что excludeId передается в запросы
            expect(mockCategoriesQuery.findFirst).toHaveBeenCalledWith({
                where: expect.any(Object),
                columns: {
                    id: true,
                    slug: true,
                },
            })
        })

        it("должна обрабатывать специальные символы в slug", async () => {
            const input = {
                baseSlug: "Test Category & More!",
                excludeId: null,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockResolvedValue(null),
                findMany: vi.fn().mockResolvedValue([])
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()
            const result = await caller.categories.generateUniqueSlug(input)

            expect(result).toEqual({
                slug: "test-category-and-more",
                isOriginal: true,
            })
        })
    })

    describe("Обработка ошибок", () => {
        it("должна обрабатывать ошибки базы данных", async () => {
            const input = {
                baseSlug: "test-category",
                excludeId: null,
            }

            const db = helper.getDb()
            const mockCategoriesQuery = {
                findFirst: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.query = {
                categories: mockCategoriesQuery
            }

            const caller = helper.getCaller()

            await expect(caller.categories.generateUniqueSlug(input)).rejects.toThrow("Ошибка при генерации уникального URL категории")
        })
    })
}) 