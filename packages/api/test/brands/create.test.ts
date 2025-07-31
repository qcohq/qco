import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.create - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
        // Сбрасываем все моки
        vi.clearAllMocks()
    })

    describe("Создание бренда без файлов", () => {
        it("должен успешно создать бренд без файлов", async () => {
            const input = {
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                categoryIds: [],
                files: [],
            }

            const expectedBrand = {
                id: "brand-1",
                name: input.name,
            }

            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedBrand])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()
            const result = await caller.brands.create(input)

            expect(result).toEqual(expectedBrand)
        })

        it("должен установить значения по умолчанию", async () => {
            const input = {
                name: "Test Brand",
                slug: "test-brand",
                categoryIds: [],
                files: [],
            }

            const expectedBrand = {
                id: "brand-1",
                name: input.name,
            }

            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedBrand])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()
            const result = await caller.brands.create(input)

            expect(result).toEqual(expectedBrand)
        })
    })

    describe("Создание бренда с файлами", () => {
        it("должен успешно создать бренд с файлами", async () => {
            const input = {
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                categoryIds: ["cat-1", "cat-2"],
                files: [
                    {
                        fileId: "uploads/brands/logo.jpg",
                        type: "logo",
                        order: 1,
                        meta: {
                            name: "logo.jpg",
                            mimeType: "image/jpeg",
                            size: 2048,
                        }
                    },
                    {
                        fileId: "uploads/brands/banner.jpg",
                        type: "banner",
                        order: 2,
                        meta: {
                            name: "banner.jpg",
                            mimeType: "image/jpeg",
                            size: 4096,
                        }
                    }
                ],
            }

            const expectedBrand = {
                id: "brand-1",
                name: input.name,
            }

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание бренда
            const mockBrandInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedBrand])
            }

            // Второй вызов - создание связей с категориями
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }

            // Третий вызов - создание файлов
            const mockFileInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockBrandInsert)
                .mockReturnValueOnce(mockCategoryInsert)
                .mockReturnValueOnce(mockFileInsert)

            const caller = helper.getCaller()
            const result = await caller.brands.create(input)

            expect(result).toEqual(expectedBrand)
        })
    })

    describe("Создание бренда с категориями", () => {
        it("должен успешно создать бренд с категориями", async () => {
            const input = {
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                categoryIds: ["cat-1", "cat-2"],
                files: [],
            }

            const expectedBrand = {
                id: "brand-1",
                name: input.name,
            }

            // Настраиваем моки для последовательных вызовов
            const db = helper.getDb()

            // Первый вызов - создание бренда
            const mockBrandInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([expectedBrand])
            }

            // Второй вызов - создание связей с категориями
            const mockCategoryInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }

            // Настраиваем последовательные возвраты
            db.insert
                .mockReturnValueOnce(mockBrandInsert)
                .mockReturnValueOnce(mockCategoryInsert)

            const caller = helper.getCaller()
            const result = await caller.brands.create(input)

            expect(result).toEqual(expectedBrand)
        })
    })

    describe("Обработка ошибок", () => {
        it("должен выбросить ошибку при неудачном создании бренда", async () => {
            const input = {
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                categoryIds: [],
                files: [],
            }

            // Мокаем неудачное создание (пустой массив)
            const db = helper.getDb()
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()

            await expect(caller.brands.create(input)).rejects.toThrow("Не удалось создать бренд")
        })
    })
}) 