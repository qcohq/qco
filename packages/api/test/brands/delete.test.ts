import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

// Мокаем deleteFile из @qco/lib
vi.mock("@qco/lib", () => ({
    deleteFile: vi.fn().mockResolvedValue(undefined)
}))

describe("brands.delete - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Удаление бренда", () => {
        it("должен успешно удалить бренд", async () => {
            const input = {
                id: "brand-1",
            }

            // Мокаем пустой список файлов бренда
            const db = helper.getDb()
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])

            // Мокаем удаление бренда
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.delete(input)

            expect(result).toEqual({ success: true })
        })

        it("должен успешно удалить бренд с файлами", async () => {
            const input = {
                id: "brand-1",
            }

            const mockBrandFiles = [
                {
                    id: "bf-1",
                    brandId: "brand-delete-1",
                    fileId: "file-1",
                    type: "logo",
                    order: 1,
                    createdAt: new Date(),
                },
                {
                    id: "bf-2",
                    brandId: "brand-delete-1",
                    fileId: "file-2",
                    type: "banner",
                    order: 2,
                    createdAt: new Date(),
                },
            ]

            const mockFiles = [
                {
                    id: "file-1",
                    path: "uploads/brands/logo.jpg",
                    name: "logo.jpg",
                    mimeType: "image/jpeg",
                    size: 2048,
                    type: "brand_logo",
                    uploadedBy: "user-1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "file-2",
                    path: "uploads/brands/banner.jpg",
                    name: "banner.jpg",
                    mimeType: "image/jpeg",
                    size: 4096,
                    type: "brand_banner",
                    uploadedBy: "user-1",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]

            // Мокаем запросы к базе данных
            const db = helper.getDb()
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue(mockBrandFiles)
            db.query.files.findMany = vi.fn().mockResolvedValue(mockFiles)

            // Мокаем удаления
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.delete(input)

            expect(result).toEqual({ success: true })
        })

        it("должен успешно удалить несуществующий бренд (без ошибки)", async () => {
            const input = {
                id: "non-existent-brand",
            }

            // Мокаем пустой список файлов бренда
            const db = helper.getDb()
            db.query.brandFiles.findMany = vi.fn().mockResolvedValue([])

            // Мокаем удаление бренда
            const mockDelete = {
                where: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([])
            }
            db.delete.mockReturnValue(mockDelete)

            const caller = helper.getCaller()
            const result = await caller.brands.delete(input)

            expect(result).toEqual({ success: true })
        })

        it("должен выбросить ошибку при неудачном удалении", async () => {
            const input = {
                id: "brand-1",
            }

            // Мокаем ошибку при запросе файлов бренда
            const db = helper.getDb()
            db.query.brandFiles.findMany = vi.fn().mockRejectedValue(new Error("Database connection failed"))

            const caller = helper.getCaller()

            await expect(caller.brands.delete(input)).rejects.toThrow("Database connection failed")
        })
    })
}) 