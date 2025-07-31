import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("categories.create - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Создание категории без изображения", () => {
        it("должна успешно создать категорию без изображения", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
            })

            helper.mockInsert(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(1)
        })

        it("должна установить значения по умолчанию", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: null,
                parentId: null,
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
                description: null,
                isActive: undefined,
                sortOrder: undefined,
            })

            helper.mockInsert(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(1)
        })
    })

    describe("Создание категории с изображением", () => {
        it("должна успешно создать категорию с изображением", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
                image: {
                    fileId: "uploads/categories/test-image.jpg",
                    url: "https://example.com/test-image.jpg",
                    meta: {
                        name: "test-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            const mockFile = TestUtils.createFile({
                id: "file-1",
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

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание файла
            const mockFileInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([mockFile])
            }

            // Второй вызов - создание категории  
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockFileInsert)
                .mockReturnValueOnce(mockCategoryInsert)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(2)
        })
    })

    describe("Обработка ошибок", () => {
        it("должна выбросить ошибку при неудачном создании файла", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
                image: {
                    fileId: "uploads/categories/test-image.jpg",
                    url: "https://example.com/test-image.jpg",
                    meta: {
                        name: "test-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            // Мокаем неудачное создание файла (пустой массив)
            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()

            // Проверяем, что выбрасывается ошибка
            await expect(caller.categories.create(input)).rejects.toThrow()
        })

        it("должна выбросить ошибку при неудачном создании категории", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
            }

            // Мокаем неудачное создание категории (пустой массив)
            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()

            // Проверяем, что выбрасывается ошибка
            await expect(caller.categories.create(input)).rejects.toThrow()
        })
    })

    describe("Создание категории с типами продуктов", () => {
        it("должна успешно создать категорию с одним типом продукта", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: ["pt-1"],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
            })

            const expectedProductTypeLink = TestUtils.createCategoryProductType({
                categoryId: expectedCategory.id,
                productTypeId: "pt-1",
                isPrimary: true,
                sortOrder: 0,
            })

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание категории
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }

            // Второй вызов - создание связей с типами продуктов
            const mockProductTypeInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedProductTypeLink])
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockCategoryInsert)
                .mockReturnValueOnce(mockProductTypeInsert)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(2)
        })

        it("должна успешно создать категорию с несколькими типами продуктов", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: ["pt-1", "pt-2", "pt-3"],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
            })

            const expectedProductTypeLinks = [
                TestUtils.createCategoryProductType({
                    id: "cpt-1",
                    categoryId: expectedCategory.id,
                    productTypeId: "pt-1",
                    isPrimary: true,
                    sortOrder: 0,
                }),
                TestUtils.createCategoryProductType({
                    id: "cpt-2",
                    categoryId: expectedCategory.id,
                    productTypeId: "pt-2",
                    isPrimary: false,
                    sortOrder: 1,
                }),
                TestUtils.createCategoryProductType({
                    id: "cpt-3",
                    categoryId: expectedCategory.id,
                    productTypeId: "pt-3",
                    isPrimary: false,
                    sortOrder: 2,
                }),
            ]

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание категории
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }

            // Второй вызов - создание связей с типами продуктов
            const mockProductTypeInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(expectedProductTypeLinks)
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockCategoryInsert)
                .mockReturnValueOnce(mockProductTypeInsert)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(2)
        })

        it("должна успешно создать категорию с пустым массивом productTypeIds", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: [],
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
            })

            helper.mockInsert(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(1) // Только создание категории, без связей
        })

        it("должна успешно создать категорию без указания productTypeIds", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
            }

            const expectedCategory = TestUtils.createCategory({
                ...input,
                id: "cat-1",
            })

            helper.mockInsert(expectedCategory)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(1) // Только создание категории, без связей
        })

        it("должна успешно создать категорию с изображением и типами продуктов", async () => {
            const input = {
                name: "Test Category",
                slug: "test-category",
                description: "Test description",
                isActive: true,
                isFeatured: false,
                sortOrder: 1,
                parentId: null,
                productTypeIds: ["pt-1", "pt-2"],
                image: {
                    fileId: "uploads/categories/test-image.jpg",
                    url: "https://example.com/test-image.jpg",
                    meta: {
                        name: "test-image.jpg",
                        mimeType: "image/jpeg",
                        size: 2048,
                    }
                }
            }

            const mockFile = TestUtils.createFile({
                id: "file-1",
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

            const expectedProductTypeLinks = [
                TestUtils.createCategoryProductType({
                    id: "cpt-1",
                    categoryId: expectedCategory.id,
                    productTypeId: "pt-1",
                    isPrimary: true,
                    sortOrder: 0,
                }),
                TestUtils.createCategoryProductType({
                    id: "cpt-2",
                    categoryId: expectedCategory.id,
                    productTypeId: "pt-2",
                    isPrimary: false,
                    sortOrder: 1,
                }),
            ]

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание файла
            const mockFileInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([mockFile])
            }

            // Второй вызов - создание категории
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedCategory])
            }

            // Третий вызов - создание связей с типами продуктов
            const mockProductTypeInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(expectedProductTypeLinks)
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockFileInsert)
                .mockReturnValueOnce(mockCategoryInsert)
                .mockReturnValueOnce(mockProductTypeInsert)

            const caller = helper.getCaller()
            const result = await caller.categories.create(input)

            expect(result).toEqual(expectedCategory)
            helper.expectInsertCalled(3) // Файл + категория + связи
        })
    })
})
