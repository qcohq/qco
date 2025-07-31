import { z } from "zod";

// Схема входных данных для получения продуктов по категории
export const getByCategorySchema = z.object({
  categorySlug: z.string().min(1, "Category slug is required"),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  sort: z.enum(["newest", "price-asc", "price-desc", "name-asc", "name-desc", "popular"]).default("newest"),
  // Добавляем поддержку фильтров
  filters: z.object({
    brands: z.array(z.string()).optional(),
    priceRange: z.tuple([z.number(), z.number()]).optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    onSale: z.boolean().optional(),
    attributes: z.record(z.string(), z.array(z.string())).optional(),
  }).optional(),
});

// Схема для варианта продукта
export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  price: z.number(), // decimal в БД, но возвращается как number
  salePrice: z.number().nullable(),
  costPrice: z.number().nullable(),
  stock: z.number(),
  minStock: z.number(),
  weight: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  depth: z.number().nullable(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

// Схема для файла продукта
export const productFileSchema = z.object({
  id: z.string(),
  url: z.string(), // path из БД, но возвращается как url
  alt: z.string().nullable(),
  type: z.string(),
  order: z.number(),
});

// Схема для продукта в ответе
export const productResponseSchema = z.object({
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
  images: z.array(z.string()),
  category: z.string().nullable(),
  brand: z.string().nullable(),
  variants: z.array(productVariantSchema),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  attributes: z.record(z.string(), z.array(z.string())),
  // Дополнительные вычисляемые поля
  onSale: z.boolean(),
  inStock: z.boolean(),
  rating: z.number(),
});

// Схема для ответа с продуктами по категории
export const getByCategoryResponseSchema = z.object({
  products: z.array(productResponseSchema),
  totalCount: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Типы для TypeScript
export type GetByCategoryInput = z.infer<typeof getByCategorySchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type ProductFile = z.infer<typeof productFileSchema>;
export type GetByCategoryResponse = z.infer<typeof getByCategoryResponseSchema>;
