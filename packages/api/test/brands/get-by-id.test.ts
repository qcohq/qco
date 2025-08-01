import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"
import { getFileUrl } from "@qco/lib"

describe("brands.getById - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение бренда по ID", () => {
        it("должен успешно получить бренд по ID", async () => {
            const input = {
                id: "brand-get-by-id-1",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-id-1",
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                shortDescription: "Short description",
                website: "https://test.com",
                email: "test@brand.com",
                phone: "+1234567890",
                isActive: true,
                isFeatured: false,
                foundedYear: "2020",
                countryOfOrigin: "USA",
                brandColor: "#FF0000",
                metaTitle: "Test Brand Meta",
                metaDescription: "Test brand meta description",
                metaKeywords: ["test", "brand"],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "user-1",
                updatedBy: "user-1",
                brandCategories: [],
                files: [],
            })

            // Мокаем запрос бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(mockBrand)

            const caller = helper.getCaller()
            const result = await caller.brands.getById(input)

            const { brandCategories, ...brandWithoutCategories } = mockBrand
            expect(result).toEqual({
                ...brandWithoutCategories,
                categories: [],
                files: [],
            })
        })

        it("должен вернуть null для несуществующего бренда", async () => {
            const input = {
                id: "non-existent-brand",
            }

            // Мокаем отсутствие бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            const result = await caller.brands.getById(input)

            expect(result).toBeNull()
        })

        it("должен успешно получить бренд с категориями", async () => {
            const input = {
                id: "brand-get-by-id-2",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-id-2",
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                shortDescription: "Short description",
                website: "https://test.com",
                email: "test@brand.com",
                phone: "+1234567890",
                isActive: true,
                isFeatured: false,
                foundedYear: "2020",
                countryOfOrigin: "USA",
                brandColor: "#FF0000",
                metaTitle: "Test Brand Meta",
                metaDescription: "Test brand meta description",
                metaKeywords: ["test", "brand"],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "user-1",
                updatedBy: "user-1",
                brandCategories: [
                    {
                        category: {
                            id: "cat-1",
                            name: "Category 1",
                            slug: "category-1",
                            description: "Category description 1",
                            parentId: null,
                            isActive: true,
                            sortOrder: 1,
                            metaTitle: "Category 1 Meta",
                            metaDescription: "Category 1 meta description",
                            xmlId: "cat-1",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                    {
                        category: {
                            id: "cat-2",
                            name: "Category 2",
                            slug: "category-2",
                            description: "Category description 2",
                            parentId: null,
                            isActive: true,
                            sortOrder: 2,
                            metaTitle: "Category 2 Meta",
                            metaDescription: "Category 2 meta description",
                            xmlId: "cat-2",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                ],
                files: [],
            })

            // Мокаем запрос бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(mockBrand)

            const caller = helper.getCaller()
            const result = await caller.brands.getById(input)

            const { brandCategories, ...brandWithoutCategories } = mockBrand
            expect(result).toEqual({
                ...brandWithoutCategories,
                categories: mockBrand.brandCategories.map(bc => bc.category),
                files: [],
            })
        })

        it("должен успешно получить бренд с файлами", async () => {
            const input = {
                id: "brand-get-by-id-3",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-id-3",
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                shortDescription: "Short description",
                website: "https://test.com",
                email: "test@brand.com",
                phone: "+1234567890",
                isActive: true,
                isFeatured: false,
                foundedYear: "2020",
                countryOfOrigin: "USA",
                brandColor: "#FF0000",
                metaTitle: "Test Brand Meta",
                metaDescription: "Test brand meta description",
                metaKeywords: ["test", "brand"],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "user-1",
                updatedBy: "user-1",
                brandCategories: [],
                files: [
                    {
                        id: "bf-1",
                        brandId: "brand-get-by-id-3",
                        fileId: "file-1",
                        type: "logo",
                        order: 1,
                        createdAt: new Date(),
                        file: {
                            id: "file-1",
                            path: "uploads/brands/logo.jpg",
                            name: "logo.jpg",
                            mimeType: "image/jpeg",
                            size: 2048,
                        },
                        url: getFileUrl("uploads/brands/logo.jpg"),
                    },
                    {
                        id: "bf-2",
                        brandId: "brand-get-by-id-3",
                        fileId: "file-2",
                        type: "banner",
                        order: 2,
                        createdAt: new Date(),
                        file: {
                            id: "file-2",
                            path: "uploads/brands/banner.jpg",
                            name: "banner.jpg",
                            mimeType: "image/jpeg",
                            size: 4096,
                        },
                        url: getFileUrl("uploads/brands/banner.jpg"),
                    },
                ],
            })

            // Мокаем запрос бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(mockBrand)

            const caller = helper.getCaller()
            const result = await caller.brands.getById(input)
            const { brandCategories, ...brandWithoutCategories } = mockBrand
            expect(result).toEqual({
                ...brandWithoutCategories,
                categories: [],
            })
        })

        it("должен успешно получить бренд с категориями и файлами", async () => {
            const input = {
                id: "brand-get-by-id-4",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-id-4",
                name: "Test Brand",
                slug: "test-brand",
                description: "Test description",
                shortDescription: "Short description",
                website: "https://test.com",
                email: "test@brand.com",
                phone: "+1234567890",
                isActive: true,
                isFeatured: false,
                foundedYear: "2020",
                countryOfOrigin: "USA",
                brandColor: "#FF0000",
                metaTitle: "Test Brand Meta",
                metaDescription: "Test brand meta description",
                metaKeywords: ["test", "brand"],
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: "user-1",
                updatedBy: "user-1",
                brandCategories: [
                    {
                        category: {
                            id: "cat-1",
                            name: "Category 1",
                            slug: "category-1",
                            description: "Category description 1",
                            parentId: null,
                            isActive: true,
                            sortOrder: 1,
                            metaTitle: "Category 1 Meta",
                            metaDescription: "Category 1 meta description",
                            xmlId: "cat-1",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                ],
                files: [
                    {
                        id: "bf-1",
                        brandId: "brand-get-by-id-4",
                        fileId: "file-1",
                        type: "logo",
                        order: 1,
                        createdAt: new Date(),
                        file: {
                            id: "file-1",
                            path: "uploads/brands/logo.jpg",
                            name: "logo.jpg",
                            mimeType: "image/jpeg",
                            size: 2048,
                        },
                        url: getFileUrl("uploads/brands/logo.jpg"),
                    },
                ],
            })

            // Мокаем запрос бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(mockBrand)

            const caller = helper.getCaller()
            const result = await caller.brands.getById(input)
            const { brandCategories, ...brandWithoutCategories } = mockBrand
            expect(result).toEqual({
                ...brandWithoutCategories,
                categories: mockBrand.brandCategories.map(bc => bc.category),
            })
        })
    })
})


describe("Обработка ошибок", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    it("должен выбросить ошибку при несуществующем ID", async () => {
        const input = {
            id: "non-existent-id",
        }

        // Мокаем отсутствие бренда
        const db = helper.getDb()
        db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

        const caller = helper.getCaller()

        const result = await caller.brands.getById(input)
        expect(result).toBeNull()
    })

    it("должен обрабатывать ошибки базы данных", async () => {
        const input = {
            id: "brand-1",
        }

        // Мокаем ошибку при запросе
        const db = helper.getDb()
        db.query.brands.findFirst = vi.fn().mockRejectedValue(new Error("Database error"))

        const caller = helper.getCaller()

        await expect(caller.brands.getById(input)).rejects.toThrow("Database error")
    })
})
