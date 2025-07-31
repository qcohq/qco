import { z } from "zod";

// Схема входных данных для получения всех продуктов каталога
export const getAllForCatalogInputSchema = z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    sort: z.enum(["newest", "price-asc", "price-desc", "name-asc", "name-desc", "popular"]).default("newest"),
});

// Схема продукта для каталога
export const catalogProductSchema = z.object({
    id: z.string(),
    brandId: z.string().nullable(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    isPopular: z.boolean(), // добавлено поле из БД
    isNew: z.boolean(),
    stock: z.number().nullable(),
    sku: z.string().nullable(),
    basePrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    discountPercent: z.number().nullable(),
    hasVariants: z.boolean(),
    productTypeId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    seoTitle: z.string().nullable(),
    seoUrl: z.string().nullable(),
    seoDescription: z.string().nullable(),
    seoKeywords: z.string().nullable(),
    xmlId: z.string().nullable(),
    // Вычисляемые поля для фронтенда
    image: z.string().nullable(),
    category: z.string().nullable(),
    brand: z.string().nullable(),
});

// Схема ответа для получения всех продуктов каталога
export const getAllForCatalogResponseSchema = z.object({
    products: z.array(catalogProductSchema),
    totalCount: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

// Типы для удобства
export type GetAllForCatalogInput = z.infer<typeof getAllForCatalogInputSchema>;
export type CatalogProduct = z.infer<typeof catalogProductSchema>;
export type GetAllForCatalogResponse = z.infer<typeof getAllForCatalogResponseSchema>; 