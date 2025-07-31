import { z } from "zod";

// Базовая схема продукта (соответствует таблице products)
export const productSchema = z.object({
  id: z.string(),
  brandId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
  isNew: z.boolean(),
  stock: z.number().nullable(),
  sku: z.string().nullable(),
  basePrice: z.number().nullable(), // decimal в БД, но возвращаем как number
  salePrice: z.number().nullable(), // decimal в БД, но возвращаем как number
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
  // Дополнительные поля для фронтенда
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  video: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  rating: z.number().optional(),
  inStock: z.boolean().default(true),
  variants: z.array(z.unknown()).optional().nullable(),
  colors: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        hex: z.string(),
      }),
    )
    .optional(),
  sizes: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        inStock: z.boolean().optional(),
      }),
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  attributes: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

// Схема входных данных для getNewArrivals
export const getNewArrivalsInputSchema = z.object({
  limit: z.number().min(1).max(50).default(12),
  days: z.number().min(1).max(365).default(30), // Количество дней для определения "новых" товаров
  categorySlug: z.string().optional(), // Фильтр по категории
});

// Схема одного товара для getNewArrivals (соответствует таблице products)
export const getNewArrivalsProductSchema = z.object({
  id: z.string(),
  brandId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
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
  // Дополнительные поля для фронтенда
  image: z.string().nullable(),
  images: z.array(z.string()).optional(),
  category: z.string().nullable(),
  brand: z.string().nullable(),
});

// Схема массива товаров для getNewArrivals
export const getNewArrivalsResponseSchema = z.array(
  getNewArrivalsProductSchema,
);

// Схема входных данных для getFeaturedProducts
export const getFeaturedProductsInputSchema = z.object({
  limit: z.number().min(1).max(50).default(8),
  categorySlug: z.string().optional(), // Фильтр по категории
});

// Схема одного товара для getFeaturedProducts (используем базовую схему)
export const getFeaturedProductsProductSchema = productSchema;

// Схема массива товаров для getFeaturedProducts
export const getFeaturedProductsResponseSchema = z.array(
  getFeaturedProductsProductSchema,
);

// Схема входных данных для получения продукта по slug
export const getProductBySlugInputSchema = z.object({
  slug: z.string().min(1, "Slug продукта обязателен"),
});

// Схема ответа для получения продукта по slug
export const getProductBySlugResponseSchema = productSchema;

// Схема элемента продукта для списков
export const productItemSchema = z.object({
  id: z.string(),
  brandId: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
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
  // Дополнительные поля для фронтенда
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  brand: z.string().nullable(),
  inStock: z.boolean(),
  category: z.string().nullable().optional(),
  rating: z.number().optional(),
  // Поля для фильтрации
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  attributes: z.record(z.string(), z.array(z.string())).optional(),
});

// Схема входных данных для getNew
export const getNewInputSchema = z.object({
  category: z.enum(["men", "women", "kids"]),
  limit: z.number().min(1).max(50).default(12),
  days: z.number().min(1).max(365).default(30),
});

// Схема ответа для getNew
export const getNewResponseSchema = z.array(productItemSchema);

// Схема входных данных для getSale
export const getSaleInputSchema = z.object({
  category: z.enum(["men", "women", "kids"]),
  limit: z.number().min(1).max(50).default(12),
});

// Схема ответа для getSale
export const getSaleResponseSchema = z.array(productItemSchema);

// Типы для удобства
export type ProductItem = z.infer<typeof productItemSchema>;
export type GetNewInput = z.infer<typeof getNewInputSchema>;
export type GetNewResponse = z.infer<typeof getNewResponseSchema>;
export type GetSaleInput = z.infer<typeof getSaleInputSchema>;
export type GetSaleResponse = z.infer<typeof getSaleResponseSchema>;

export type GetNewArrivalsInput = z.infer<typeof getNewArrivalsInputSchema>;
export type GetNewArrivalsProduct = z.infer<typeof getNewArrivalsProductSchema>;
export type GetNewArrivalsResponse = z.infer<
  typeof getNewArrivalsResponseSchema
>;
export type GetFeaturedProductsInput = z.infer<typeof getFeaturedProductsInputSchema>;
export type GetFeaturedProductsProduct = z.infer<typeof getFeaturedProductsProductSchema>;
export type GetFeaturedProductsResponse = z.infer<
  typeof getFeaturedProductsResponseSchema
>;
export type GetProductBySlugInput = z.infer<typeof getProductBySlugInputSchema>;
export type GetProductBySlugResponse = z.infer<typeof getProductBySlugResponseSchema>;

// Новые схемы для динамических фильтров
// export const getDynamicCategoryFiltersSchema = z.object({
//   categorySlug: z.string(),
//   // Текущие фильтры, которые уже применены
//   appliedFilters: z.object({
//     brands: z.array(z.string()).optional(),
//     priceRange: z.tuple([z.number(), z.number()]).optional(),
//     sizes: z.array(z.string()).optional(),
//     colors: z.array(z.string()).optional(),
//     inStock: z.boolean().optional(),
//     onSale: z.boolean().optional(),
//     attributes: z.record(z.array(z.string())).optional(),
//   }).optional(),
// });

// Типы для динамических фильтров
// export type GetDynamicCategoryFiltersInput = z.infer<typeof getDynamicCategoryFiltersSchema>;
