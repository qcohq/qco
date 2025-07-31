import { describe, it, expect, beforeEach, vi } from "vitest"
import { TRPCTestHelper, TestUtils } from "../utils/test-infrastructure"

describe("brands.getAll - Реальные тесты tRPC API", () => {
    let helper: TRPCTestHelper

    beforeEach(() => {
        helper = new TRPCTestHelper()
    })

    describe("Получение списка брендов", () => {
        it("должен успешно получить список брендов", async () => {
            const input = {
                page: 1,
                limit: 10,
                search: "",
                sortBy: "name",
                sortOrder: "asc",
                isActive: undefined,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-get-all-1",
                    name: "Brand 1",
                    slug: "brand-1",
                    isActive: true,
                    isFeatured: false,
                    brandCategories: [],
                    files: [],
                }),
                TestUtils.createBrand({
                    id: "brand-get-all-2",
                    name: "Brand 2",
                    slug: "brand-2",
                    isActive: true,
                    isFeatured: true,
                    brandCategories: [],
                    files: [],
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(mockBrands)
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: mockBrands.map(brand => {
                    const { brandCategories, ...brandWithoutCategories } = brand
                    return {
                        ...brandWithoutCategories,
                        categories: [],
                        files: [],
                    }
                }),
                meta: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    pageCount: 1,
                },
            })
        })

        it("должен успешно получить список брендов с пагинацией", async () => {
            const input = {
                page: 2,
                limit: 5,
                search: "",
                sortBy: "name",
                sortOrder: "asc",
                isActive: undefined,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-get-all-3",
                    name: "Brand 6",
                    slug: "brand-6",
                    brandCategories: [],
                    files: [],
                }),
                TestUtils.createBrand({
                    id: "brand-get-all-4",
                    name: "Brand 7",
                    slug: "brand-7",
                    brandCategories: [],
                    files: [],
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(mockBrands)
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: mockBrands.map(brand => {
                    const { brandCategories, ...brandWithoutCategories } = brand
                    return {
                        ...brandWithoutCategories,
                        categories: [],
                        files: [],
                    }
                }),
                meta: {
                    page: 2,
                    limit: 5,
                    total: 2,
                    pageCount: 1,
                },
            })
        })

        it("должен успешно получить список брендов с поиском", async () => {
            const input = {
                page: 1,
                limit: 10,
                search: "test",
                sortBy: "name",
                sortOrder: "asc",
                isActive: undefined,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-get-all-5",
                    name: "Test Brand",
                    slug: "test-brand",
                    brandCategories: [],
                    files: [],
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(mockBrands)
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: mockBrands.map(brand => {
                    const { brandCategories, ...brandWithoutCategories } = brand
                    return {
                        ...brandWithoutCategories,
                        categories: [],
                        files: [],
                    }
                }),
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    pageCount: 1,
                },
            })
        })

        it("должен успешно получить список брендов с фильтром по активности", async () => {
            const input = {
                page: 1,
                limit: 10,
                search: "",
                sortBy: "name",
                sortOrder: "asc",
                isActive: true,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-get-all-6",
                    name: "Active Brand",
                    slug: "active-brand",
                    isActive: true,
                    brandCategories: [],
                    files: [],
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(mockBrands)
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: mockBrands.map(brand => {
                    const { brandCategories, ...brandWithoutCategories } = brand
                    return {
                        ...brandWithoutCategories,
                        categories: [],
                        files: [],
                    }
                }),
                meta: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    pageCount: 1,
                },
            })
        })

        it("должен успешно получить список брендов с сортировкой", async () => {
            const input = {
                page: 1,
                limit: 10,
                search: "",
                sortBy: "createdAt",
                sortOrder: "desc",
                isActive: undefined,
            }

            const mockBrands = [
                TestUtils.createBrand({
                    id: "brand-get-all-7",
                    name: "Brand 2",
                    slug: "brand-2",
                    createdAt: new Date("2024-01-02"),
                    brandCategories: [],
                    files: [],
                }),
                TestUtils.createBrand({
                    id: "brand-get-all-8",
                    name: "Brand 1",
                    slug: "brand-1",
                    createdAt: new Date("2024-01-01"),
                    brandCategories: [],
                    files: [],
                }),
            ]

            // Мокаем запрос брендов
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue(mockBrands)

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue(mockBrands)
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: mockBrands.map(brand => {
                    const { brandCategories, ...brandWithoutCategories } = brand
                    return {
                        ...brandWithoutCategories,
                        categories: [],
                        files: [],
                    }
                }),
                meta: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    pageCount: 1,
                },
            })
        })

        it("должен вернуть пустой список при отсутствии брендов", async () => {
            const input = {
                page: 1,
                limit: 10,
                search: "",
                sortBy: "name",
                sortOrder: "asc",
                isActive: undefined,
            }

            // Мокаем пустой результат
            const db = helper.getDb()
            db.query.brands.findMany = vi.fn().mockResolvedValue([])

            // Мокаем подсчет общего количества
            const mockSelect = {
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockResolvedValue([])
            }
            db.select.mockReturnValue(mockSelect)

            const caller = helper.getCaller()
            const result = await caller.brands.getAll(input)

            expect(result).toEqual({
                items: [],
                meta: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pageCount: 0,
                },
            })
        })
    })
}) 