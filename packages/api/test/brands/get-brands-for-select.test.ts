import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.getBrandsForSelect - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение брендов для выбора", () => {
        it("должен успешно получить список брендов для выбора", async () => {
            const input = {
                search: "",
                limit: 10,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-select-1",
                    name: "Brand 1",
                    slug: "brand-1",
                    isActive: true,
                }),
                TestUtils.createBrand({
                    id: "brand-select-2",
                    name: "Brand 2",
                    slug: "brand-2",
                    isActive: true,
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            const caller = helper.getCaller()
            const result = await caller.brands.getBrandsForSelect(input)

            expect(result).toEqual({
                data: mockBrands.map(brand => ({
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description,
                    shortDescription: brand.shortDescription,
                    website: brand.website,
                    email: brand.email,
                    phone: brand.phone,
                    isActive: brand.isActive,
                    isFeatured: brand.isFeatured,
                    foundedYear: brand.foundedYear,
                    countryOfOrigin: brand.countryOfOrigin,
                    brandColor: brand.brandColor,
                })),
                pagination: {
                    hasMore: false,
                    total: 2,
                },
            })
        })

        it("должен успешно получить список брендов с поиском", async () => {
            const input = {
                search: "test",
                limit: 10,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-select-3",
                    name: "Test Brand",
                    slug: "test-brand",
                    isActive: true,
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            const caller = helper.getCaller()
            const result = await caller.brands.getBrandsForSelect(input)

            expect(result).toEqual({
                data: mockBrands.map(brand => ({
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description,
                    shortDescription: brand.shortDescription,
                    website: brand.website,
                    email: brand.email,
                    phone: brand.phone,
                    isActive: brand.isActive,
                    isFeatured: brand.isFeatured,
                    foundedYear: brand.foundedYear,
                    countryOfOrigin: brand.countryOfOrigin,
                    brandColor: brand.brandColor,
                })),
                pagination: {
                    hasMore: false,
                    total: 1,
                },
            })
        })

        it("должен успешно получить список брендов с ограничением", async () => {
            const input = {
                search: "",
                limit: 5,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-select-4",
                    name: "Brand 1",
                    slug: "brand-1",
                    isActive: true,
                }),
                TestUtils.createBrand({
                    id: "brand-select-5",
                    name: "Brand 2",
                    slug: "brand-2",
                    isActive: true,
                }),
                TestUtils.createBrand({
                    id: "brand-select-6",
                    name: "Brand 3",
                    slug: "brand-3",
                    isActive: true,
                }),
                TestUtils.createBrand({
                    id: "brand-select-7",
                    name: "Brand 4",
                    slug: "brand-4",
                    isActive: true,
                }),
                TestUtils.createBrand({
                    id: "brand-select-8",
                    name: "Brand 5",
                    slug: "brand-5",
                    isActive: true,
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            const caller = helper.getCaller()
            const result = await caller.brands.getBrandsForSelect(input)

            expect(result).toEqual({
                data: mockBrands.map(brand => ({
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description,
                    shortDescription: brand.shortDescription,
                    website: brand.website,
                    email: brand.email,
                    phone: brand.phone,
                    isActive: brand.isActive,
                    isFeatured: brand.isFeatured,
                    foundedYear: brand.foundedYear,
                    countryOfOrigin: brand.countryOfOrigin,
                    brandColor: brand.brandColor,
                })),
                pagination: {
                    hasMore: false,
                    total: 5,
                },
            })
            expect(result.data).toHaveLength(5)
        })

        it("должен вернуть пустой список при отсутствии брендов", async () => {
            const input = {
                search: "non-existent",
                limit: 10,
            }

            // Мокаем пустой результат
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue([])

            const caller = helper.getCaller()
            const result = await caller.brands.getBrandsForSelect(input)

            expect(result).toEqual({
                data: [],
                pagination: {
                    hasMore: false,
                    total: 0,
                },
            })
        })

        it("должен выбросить ошибку при неудачном запросе", async () => {
            const input = {
                search: "",
                limit: 10,
            }

            // Мокаем ошибку при запросе
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockRejectedValue(new Error("Database error"))

            const caller = helper.getCaller()
            await expect(caller.brands.getBrandsForSelect(input)).rejects.toThrow("Database error")
        })
    })
}) 