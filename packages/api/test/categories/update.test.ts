import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.update - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Обновление категории без изображения", () => {
        it("должна успешно обновить категорию без изображения", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                slug: "updated-category",
                description: "Updated description",
                isActive: true,
                isFeatured: false,
                sortOrder: 2,
                parentId: null,
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                imageId: null,
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result).toEqual(expectedCategory)
            helper.expectUpdateCalled(1)
        })

        it("должна обновить только переданные поля", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                description: "Updated description",
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                slug: "test-category", // остается старым
                imageId: null,
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result.name).toBe("Updated Category")
            expect(result.description).toBe("Updated description")
            helper.expectUpdateCalled(1)
        })
    })

    describe("Обновление категории с новым изображением", () => {
        it("должна успешно обновить категорию с новым изображением", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                slug: "updated-category",
                description: "Updated description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
                image: {
                    fileId: "uploads/categories/new-image.jpg",
                    url: "https://example.com/new-image.jpg",
                    meta: {
                        name: "new-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            const mockFile = TestUtils.createFile({
                id: "file-2",
                name: input.image!.meta!.name,
                mimeType: input.image!.meta!.mimeType,
                size: input.image!.meta!.size,
                uploadedBy: helper.getUser().id,
            })

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
                imageId: mockFile.id,
            })

            // Настраиваем последовательные моки
            const db = helper.getDb()
            const mockFileInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([mockFile])
            }
            const mockCategoryUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }

            db.insert.mockReturnValue(mockFileInsert)
            db.update.mockReturnValue(mockCategoryUpdate)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(1) // создание файла
            helper.expectUpdateCalled(1) // обновление категории
        })
    })

    describe("Обновление категории с сохранением изображения", () => {
        it("должна сохранить существующее изображение", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                slug: "updated-category",
                imageId: "existing-file-id", // сохраняем существующий файл
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                imageId: "existing-file-id",
            })

            helper.mockUpdate(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result.imageId).toBe("existing-file-id")
            helper.expectUpdateCalled(1)
            helper.expectInsertCalled(0) // не создаем новый файл
        })
    })

    describe("Валидация parentId", () => {
        it("должна выбросить ошибку при несуществующем parentId", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                parentId: "non-existent-parent",
                productTypeIds: [],
            }

            // Мокаем пустой результат поиска родительской категории
            const db = helper.getDb()
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValue([])
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()

            await expect(caller.categories.update(input)).rejects.toThrow("Родительская категория не найдена")
        })

        it("должна выбросить ошибку при попытке стать родителем самой себя", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                parentId: "cat-1", // пытаемся стать родителем самой себя
                productTypeIds: [],
            }

            const caller = helper.getCaller()

            await expect(caller.categories.update(input)).rejects.toThrow("Категория не может быть родителем самой себя")
        })

        it("должна успешно обновить с корректным parentId", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                parentId: "parent-cat-1",
                productTypeIds: [],
            }

            // Мокаем существующую родительскую категорию
            const db = helper.getDb()
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValue([{ id: "parent-cat-1" }])
            }
            db.select.mockReturnValue(mockSelect)

            const expectedCategory = TestUtils.createCategory({
                ...input,
                imageId: null,
            })

            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result).toEqual(expectedCategory)
        })

        it("должна корректно обрабатывать пустую строку как null", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                parentId: "", // пустая строка должна стать null
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                parentId: null, // ожидаем null
                imageId: null,
            })

            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }
            const db = helper.getDb()
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()
            const result = await caller.categories.update(input)

            expect(result.parentId).toBeNull()
        })
    })

    describe("Обработка ошибок", () => {
        it("должна выбросить ошибку при неудачном создании файла", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                productTypeIds: [],
                image: {
                    fileId: "uploads/categories/new-image.jpg",
                    url: "https://example.com/new-image.jpg",
                    meta: {
                        name: "new-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            // Мокаем неудачное создание файла
            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()

            await expect(caller.categories.update(input)).rejects.toThrow("Ошибка при обработке изображения")
        })

        it("должна выбросить ошибку при несуществующей категории", async () => {
            const input = {
                id: "non-existent-id",
                name: "Updated Category",
                productTypeIds: [],
            }

            // Мокаем неудачное обновление (пустой массив)
            const db = helper.getDb()
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()

            await expect(caller.categories.update(input)).rejects.toThrow("Категория не найдена")
        })

        it("должна обрабатывать ошибки базы данных", async () => {
            const input = {
                id: "cat-1",
                name: "Updated Category",
                productTypeIds: [],
                image: {
                    fileId: "uploads/categories/new-image.jpg",
                    url: "https://example.com/new-image.jpg",
                    meta: {
                        name: "new-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            // Мокаем ошибку базы данных
            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockRejectedValue(new Error("Database error"))
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()

            await expect(caller.categories.update(input)).rejects.toThrow("Ошибка при обработке изображения")
        })
    })
}) 