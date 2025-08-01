import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

// Мокаем deleteFile из @qco/lib
vi.mock("@qco/lib", () => ({
    deleteFile: vi.fn().mockResolvedValue(undefined),
}))

describe("brands.bulkDelete - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
        vi.clearAllMocks()
    })

    describe("Массовое удаление брендов", () => {
        it("должен успешно удалить несколько брендов", async () => {
            const input = {
                ids: ["brand-bulk-delete-1", "brand-bulk-delete-2", "brand-bulk-delete-3"],
            }

            const existingBrands = [
                TestUtils.createBrand({
                    id: "brand-bulk-delete-1",
                    name: "Brand 1",
                    slug: "brand-1",
                }),
                TestUtils.createBrand({
                    id: "brand-bulk-delete-2",
                    name: "Brand 2",
                    slug: "brand-2",
                }),
                TestUtils.createBrand({
                    id: "brand-bulk-delete-3",
                    name: "Brand 3",
                    slug: "brand-3",
                }),
            ]

            // Мокаем поиск существующих брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(existingBrands)

            // Мокаем brandFiles и files (нет файлов)
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])
            db.query.files.findMany = vi.fn().mockResolvedValue([])

            // Мокаем удаление brandFiles, files, brands
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(existingBrands)
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.bulkDelete(input)

            expect(result).toMatchObject({
                deletedCount: 3,
                success: true,
            })
        })

        it("должен успешно удалить бренды с файлами", async () => {
            const input = {
                ids: ["brand-bulk-delete-4", "brand-bulk-delete-5"],
            }

            const existingBrands = [
                TestUtils.createBrand({
                    id: "brand-bulk-delete-4",
                    name: "Brand 1",
                    slug: "brand-1",
                }),
                TestUtils.createBrand({
                    id: "brand-bulk-delete-5",
                    name: "Brand 2",
                    slug: "brand-2",
                }),
            ]

            // Мокаем поиск существующих брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(existingBrands)

            // Мокаем brandFiles (есть файлы у brand-bulk-delete-4)
            const brandFiles = [
                { id: "bf-1", brandId: "brand-bulk-delete-4", fileId: "file-1", type: "logo", order: 1, createdAt: new Date() },
            ]
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue(brandFiles)

            // Мокаем files (есть один файл)
            const files = [
                { id: "file-1", path: "uploads/brands/logo.jpg" },
            ]
            db.query.files.findMany = vi.fn().mockResolvedValue(files)

            // Мокаем удаление brandFiles, files, brands
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue(existingBrands)
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.bulkDelete(input)

            expect(result).toMatchObject({
                deletedCount: 2,
                success: true,
            })
        })

        it("должен вернуть пустой результат при отсутствии брендов для удаления", async () => {
            const input = { ids: ["brand-x"] }
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue([])
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])
            db.query.files.findMany = vi.fn().mockResolvedValue([])
            db.delete.mockReturnValue({ where: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) })
            const caller = helper.getCaller()
            await expect(caller.brands.bulkDelete(input)).rejects.toThrow("Не найдено брендов для удаления")
        })

        it("должен выбросить ошибку при неудачном удалении", async () => {
            const input = { ids: ["brand-1"] }
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue([TestUtils.createBrand({ id: "brand-1", name: "Brand 1", slug: "brand-1" })])
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])
            db.query.files.findMany = vi.fn().mockResolvedValue([])
            // Мокаем ошибку при удалении бренда
            db.delete.mockImplementation(() => { throw new Error("Failed to delete brands") })
            const caller = helper.getCaller()
            await expect(caller.brands.bulkDelete(input)).rejects.toThrow("Failed to delete brands")
        })

        it("должен обработать частичное удаление", async () => {
            const input = { ids: ["brand-1", "brand-3"] }
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue([TestUtils.createBrand({ id: "brand-1", name: "Brand 1", slug: "brand-1" })])
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])
            db.query.files.findMany = vi.fn().mockResolvedValue([])
            db.delete.mockReturnValue({ where: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) })
            const caller = helper.getCaller()
            await expect(caller.brands.bulkDelete(input)).rejects.toThrow("Следующие бренды не найдены: brand-3")
        })
    })
}) 