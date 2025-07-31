import { z } from "zod";

export const ProductCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ProductBrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const ProductImageSchema = z.object({
  url: z.string().nullish(),
  alt: z.string().nullish(),
});

export const ProductItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().nullish(),
  price: z.number(),
  discount: z.number(),
  stock: z.number().optional(),
  isActive: z.boolean(),
  status: z.string(),
  categories: z.array(ProductCategorySchema),
  brand: ProductBrandSchema.nullish(),
  mainImage: ProductImageSchema.nullish(),
});

export const ProductListResponseSchema = z.object({
  items: z.array(ProductItemSchema),
  meta: z.object({
    totalItems: z.number(),
    pageCount: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
  }),
});

export const ProductListInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  categories: z.array(z.string()).optional(),
  minPrice: z.number().min(0).default(0),
  maxPrice: z.number().min(0).default(10000),
  sortBy: z
    .enum(["name", "price", "stock", "createdAt", "updatedAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type ProductItem = z.infer<typeof ProductItemSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
export type ProductListInput = z.infer<typeof ProductListInputSchema>;
export type ProductTableSortConfig = Pick<
  ProductListInput,
  "sortBy" | "sortOrder"
>;
