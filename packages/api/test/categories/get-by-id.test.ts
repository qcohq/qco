import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.getById - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение категории по ID", () => {
        it("должна успешно получить категорию по ID", async () => {
            const mockCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                slug: "test-category",
                productTypeIds: [],
            })

            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockResolvedValue(mockCategory)
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getById(input)

            expect(result).toMatchObject({
                id: mockCategory.id,
                name: mockCategory.name,
                slug: mockCategory.slug,
                description: mockCategory.description,
                imageId: mockCategory.imageId,
                isActive: mockCategory.isActive,
                isFeatured: mockCategory.isFeatured,
                sortOrder: mockCategory.sortOrder,
                parentId: mockCategory.parentId,
            })
            expect(result.name).toBe("Test Category")
            expect(result.slug).toBe("test-category")
        })

        it("должна получить категорию с изображением", async () => {
            const mockCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                imageId: "file-1",
                productTypeIds: [],
            })

            const mockFile = TestUtils.createFile({
                id: "file-1",
                name: "test-image.jpg",
                path: "uploads/categories/test-image.jpg",
            })

            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockResolvedValue(mockCategory)
            db.query.files.findFirst = vi.fn().mockResolvedValue(mockFile)
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getById(input)

            expect(result.image).toBeDefined()
            expect(result.image?.fileId).toBe("file-1")
            expect(result.image?.meta.name).toBe("test-image.jpg")
        })

        it("должна обрабатывать категорию без изображения", async () => {
            const mockCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                imageId: null,
                productTypeIds: [],
            })

            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockResolvedValue(mockCategory)
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getById(input)

            expect(result.image).toBeNull()
        })

        it("должна обрабатывать категорию с несуществующим изображением", async () => {
            const mockCategory = TestUtils.createCategory({
                id: "cat-1",
                name: "Test Category",
                imageId: "non-existent-file",
                productTypeIds: [],
            })

            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockResolvedValue(mockCategory)
            db.query.files.findFirst = vi.fn().mockResolvedValue(null)
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()
            const result = await caller.categories.getById(input)

            expect(result.image).toBeNull()
        })
    })

    describe("Обработка ошибок", () => {
        it("должна выбросить ошибку при несуществующем ID", async () => {
            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockResolvedValue(null)
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "non-existent-id",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.getById(input)).rejects.toThrow("Категория с ID non-existent-id не найдена")
        })

        it("должна обрабатывать ошибки базы данных", async () => {
            const db = helper.getDb()
            db.query.categories.findFirst = vi.fn().mockRejectedValue(new Error("Database error"))
            db.query.categoryProductTypes.findMany = vi.fn().mockResolvedValue([])

            const input = {
                id: "cat-1",
            }

            const caller = helper.getCaller()

            await expect(caller.categories.getById(input)).rejects.toThrow("Ошибка получения категории")
        })
    })
}) 