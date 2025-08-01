import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.update - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Обновление бренда", () => {
        it("должен успешно обновить бренд", async () => {
            const input = {
                id: "brand-update-1",
                name: "Updated Brand",
                slug: "updated-brand",
                description: "Updated description",
                shortDescription: "Updated short description",
                website: "https://updated.com",
                email: "updated@brand.com",
                phone: "+1234567891",
                isActive: true,
                isFeatured: true,
                foundedYear: "2021",
                countryOfOrigin: "Canada",
                brandColor: "#00FF00",
                metaTitle: "Updated Brand Meta",
                metaDescription: "Updated brand meta description",
                metaKeywords: ["updated", "brand"],
                categoryIds: ["cat-1", "cat-2"],
                files: [],
            }

            const existingBrand = TestUtils.createBrand({
                id: "brand-update-1",
                name: "Original Brand",
                slug: "original-brand",
            })

            const updatedBrand = {
                id: "brand-update-1",
                name: "Updated Brand",
            }

            // Мокаем поиск существующего бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(existingBrand)

            // Мокаем обновление бренда
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([updatedBrand])
            }
            db.update.mockReturnValue(mockUpdate)

            // Мокаем удаление старых связей с категориями
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.delete.mockReturnValue(mockDelete)

            // Мокаем вставку новых связей с категориями
            const mockInsert = {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.insert.mockReturnValue(mockInsert)

            const caller = helper.getCaller()
            const result = await caller.brands.update(input)

            expect(result).toEqual(updatedBrand)
        })

        it("должен успешно обновить бренд без категорий", async () => {
            const input = {
                id: "brand-update-2",
                name: "Updated Brand",
                slug: "updated-brand",
                description: "Updated description",
                categoryIds: [],
                files: [],
            }

            const existingBrand = TestUtils.createBrand({
                id: "brand-update-2",
                name: "Original Brand",
                slug: "original-brand",
            })

            const updatedBrand = {
                id: "brand-update-2",
                name: "Updated Brand",
            }

            // Мокаем поиск существующего бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(existingBrand)

            // Мокаем обновление бренда
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([updatedBrand])
            }
            db.update.mockReturnValue(mockUpdate)

            // Мокаем удаление старых связей с категориями
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.update(input)

            expect(result).toEqual(updatedBrand)
        })

        it("должен выбросить ошибку при обновлении несуществующего бренда", async () => {
            const input = {
                id: "non-existent-brand",
                name: "Updated Brand",
                slug: "updated-brand",
                description: "Updated description",
                categoryIds: [],
                files: [],
            }

            // Мокаем отсутствие бренда
            const db = helper.getDb()
            db.update.mockReturnValue({
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            })

            const caller = helper.getCaller()
            await expect(caller.brands.update(input)).rejects.toThrow("Brand not found")
        })

        it("должен выбросить ошибку при неудачном обновлении", async () => {
            const input = {
                id: "brand-1",
                name: "Updated Brand",
                slug: "updated-brand",
                description: "Updated description",
                categoryIds: [],
                files: [],
            }

            const existingBrand = TestUtils.createBrand({
                id: "brand-1",
                name: "Original Brand",
                slug: "original-brand",
            })

            // Мокаем поиск существующего бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(existingBrand)

            // Мокаем неудачное обновление (пустой массив)
            const mockUpdate = {
                set: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.update.mockReturnValue(mockUpdate)

            const caller = helper.getCaller()
            await expect(caller.brands.update(input)).rejects.toThrow("Brand not found")
        })
    })
})
