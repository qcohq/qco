import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.getBySlug - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение бренда по slug", () => {
        it("должен успешно получить бренд по slug", async () => {
            const input = {
                slug: "test-brand",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-slug-1",
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
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])

            const caller = helper.getCaller()
            const result = await caller.brands.getBySlug(input)

            expect(result).toEqual({
                ...mockBrand,
                files: [],
            })
        })

        it("должен вернуть null для несуществующего slug", async () => {
            const input = {
                slug: "non-existent-brand",
            }

            // Мокаем отсутствие бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()

            await expect(caller.brands.getBySlug(input)).rejects.toThrow("Бренд со slug non-existent-brand не найден")
        })

        it("должен успешно получить бренд с файлами", async () => {
            const input = {
                slug: "test-brand",
            }

            const mockBrand = TestUtils.createBrand({
                id: "brand-get-by-slug-2",
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

            const mockFiles = [
                {
                    id: "bf-1",
                    brandId: "brand-1",
                    fileId: "file-1",
                    type: "logo",
                    order: 1,
                    createdAt: new Date(),
                },
                {
                    id: "bf-2",
                    brandId: "brand-1",
                    fileId: "file-2",
                    type: "banner",
                    order: 2,
                    createdAt: new Date(),
                },
            ]

            // Мокаем запрос бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(mockBrand)
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue(mockFiles)

            const caller = helper.getCaller()
            const result = await caller.brands.getBySlug(input)

            expect(result).toEqual({
                ...mockBrand,
                files: mockFiles,
            })
        })

        it("должен выбросить ошибку при неудачном запросе", async () => {
            const input = {
                slug: "test-brand",
            }

            // Мокаем ошибку при запросе
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockRejectedValue(new Error("Database error"))

            const caller = helper.getCaller()

            await expect(caller.brands.getBySlug(input)).rejects.toThrow("Database error")
        })
    })
}) 