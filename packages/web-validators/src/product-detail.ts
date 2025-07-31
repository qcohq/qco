import { z } from "zod";

// Схема для изображения продукта
export const productImageSchema = z.object({
  id: z.string(),
  url: z.string(), // path из БД, но возвращается как url
  alt: z.string().nullable(),
  type: z.string(),
  order: z.number(),
});

// Схема для опции варианта
export const productVariantOptionSchema = z.object({
  option: z.string(),
  value: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

// Схема для варианта продукта
export const productVariantDetailSchema = z.object({
  id: z.string(),
  productId: z.string(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
  options: z.array(productVariantOptionSchema).optional(),
});

// Схема для связанного продукта
export const relatedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string().nullable(),
  basePrice: z.number().nullable(),
  salePrice: z.number().nullable(),
});

// Схема для цвета
export const productColorSchema = z.object({
  name: z.string(),
  value: z.string(),
  hex: z.string().optional(),
});

// Схема для размера
export const productSizeSchema = z.object({
  name: z.string(),
  value: z.string(),
  inStock: z.boolean().optional(),
});

// Схема для детального продукта
export const productDetailSchema = z.object({
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
  images: z.array(productImageSchema),
  category: z.string().nullable(),
  brand: z.string().nullable(),
  brandSlug: z.string().nullable(),
  variants: z.array(productVariantDetailSchema),
  colors: z.array(z.union([z.string(), productColorSchema])),
  sizes: z.array(z.union([z.string(), productSizeSchema])),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  attributes: z.record(z.string(), z.string()),
  relatedProducts: z.array(relatedProductSchema),
});

// Схема входных данных
export const getProductDetailInputSchema = z.object({
  slug: z.string().min(1, "Product slug is required"),
});

// Типы для TypeScript
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductVariantDetail = z.infer<typeof productVariantDetailSchema>;
export type ProductVariantOption = z.infer<typeof productVariantOptionSchema>;
export type RelatedProduct = z.infer<typeof relatedProductSchema>;
export type GetProductDetailInput = z.infer<typeof getProductDetailInputSchema>; 
