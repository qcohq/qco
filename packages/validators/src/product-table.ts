import { z } from "zod";

// Схема для элемента бренда в таблице продуктов
export const productTableBrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
});

// Схема для изображения продукта в таблице
export const productTableImageSchema = z.object({
  url: z.string().optional(),
  alt: z.string().optional(),
});

// Схема для категории в таблице продуктов
export const productTableCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Схема для элемента таблицы продуктов
export const productTableItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().optional(),
  categories: z.array(productTableCategorySchema).optional(),
  price: z.number(),
  discount: z.number(),
  mainImage: productTableImageSchema.optional(),
  brand: productTableBrandSchema.optional(),
  status: z.string().optional(),
});

// Тип для элемента таблицы продуктов
export type ProductTableItem = z.infer<typeof productTableItemSchema>;
