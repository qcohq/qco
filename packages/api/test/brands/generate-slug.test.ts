import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.generateSlug - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Генерация slug", () => {
        it("должен успешно сгенерировать slug из названия", async () => {
            const input = {
                name: "Test Brand Name",
            }

            // Мокаем отсутствие существующего бренда с таким slug
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "test-brand-name",
                isUnique: true,
            })
        })

        it("должен успешно сгенерировать slug с специальными символами", async () => {
            const input = {
                name: "Test & Brand @ Name!",
            }

            // Мокаем отсутствие существующего бренда с таким slug
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "test-and-brand-name",
                isUnique: true,
            })
        })

        it("должен успешно сгенерировать slug с кириллицей", async () => {
            const input = {
                name: "Тестовый Бренд",
            }

            // Мокаем отсутствие существующего бренда с таким slug
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "testoviy-brend",
                isUnique: true,
            })
        })

        it("должен успешно сгенерировать уникальный slug при конфликте", async () => {
            const input = {
                name: "Test Brand",
            }

            const existingBrand = TestUtils.createBrand({
                id: "brand-1",
                name: "Test Brand",
                slug: "test-brand",
            })

            // Мокаем существующий бренд с таким slug, затем null для уникального
            const db = helper.getDb()
            let callCount = 0
            db.query.brands.findFirst = vi.fn().mockImplementation(() => {
                callCount++
                if (callCount === 1) return existingBrand // test-brand
                return null // test-brand-1 будет уникальным
            })

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "test-brand-1",
                isUnique: true,
            })
        })

        it("должен успешно сгенерировать уникальный slug при множественных конфликтах", async () => {
            const input = {
                name: "Test Brand",
            }

            const existingBrands = [
                TestUtils.createBrand({
                    id: "brand-1",
                    name: "Test Brand",
                    slug: "test-brand",
                }),
                TestUtils.createBrand({
                    id: "brand-2",
                    name: "Test Brand",
                    slug: "test-brand-1",
                }),
                TestUtils.createBrand({
                    id: "brand-3",
                    name: "Test Brand",
                    slug: "test-brand-2",
                }),
            ]

            // Мокаем существующие бренды с такими slug
            const db = helper.getDb()
            let callCount = 0
            db.query.brands.findFirst = vi.fn().mockImplementation(() => {
                callCount++
                if (callCount === 1) return existingBrands[0] // test-brand
                if (callCount === 2) return existingBrands[1] // test-brand-1
                if (callCount === 3) return existingBrands[2] // test-brand-2
                return null // test-brand-3 будет уникальным
            })

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "test-brand-3",
                isUnique: true,
            })
        })

        it("должен успешно сгенерировать slug из пустой строки", async () => {
            const input = {
                name: "",
            }

            // Мокаем отсутствие существующего бренда с таким slug
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            await expect(caller.brands.generateSlug(input)).rejects.toThrow()
        })

        it("должен успешно сгенерировать slug из строки с пробелами", async () => {
            const input = {
                name: "   Test   Brand   ",
            }

            // Мокаем отсутствие существующего бренда с таким slug
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockResolvedValue(null)

            const caller = helper.getCaller()
            const result = await caller.brands.generateSlug(input)

            expect(result).toEqual({
                slug: "test-brand",
                isUnique: true,
            })
        })

        it("должен выбросить ошибку при неудачной генерации slug", async () => {
            const input = {
                name: "Test Brand",
            }

            // Мокаем ошибку при поиске бренда
            const db = helper.getDb()
            db.query.brands.findFirst = vi.fn().mockRejectedValue(new Error("Database error"))

            const caller = helper.getCaller()
            await expect(caller.brands.generateSlug(input)).rejects.toThrow("Database error")
        })
    })
}) 