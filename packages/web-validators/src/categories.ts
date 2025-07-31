import { z } from "zod";

// Схема для изображения категории
export const categoryImageSchema = z.object({
  fileId: z.string(),
  url: z.string(),
  meta: z.object({
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
});

// Схема категории (соответствует таблице categories)
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  xmlId: z.string().nullable(),
  description: z.string().nullable(),
  parentId: z.string().nullable(),
  imageId: z.string().nullable(),
  image: categoryImageSchema.nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Вычисляемые поля для фронтенда
  productsCount: z.number(),
  hasChildren: z.boolean(),
  level: z.number(),
});

// Схема для иерархического дерева категорий
export const categoryTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  xmlId: z.string().nullable(),
  description: z.string().nullable(),
  parentId: z.string().nullable(),
  imageId: z.string().nullable(),
  image: categoryImageSchema.nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Вычисляемые поля для фронтенда
  productsCount: z.number(),
  hasChildren: z.boolean(),
  level: z.number(),
  children: z.array(z.any()).optional(),
});

// Схема входных данных для получения категории по slug
export const getCategoryBySlugInputSchema = z.object({
  slug: z.string().min(1, "Slug категории обязателен"),
});

// Схема ответа для получения категории по slug
export const getCategoryBySlugResponseSchema = categorySchema;

// Схема ответа для получения всех категорий
export const getAllCategoriesResponseSchema = z.array(categorySchema);

// Схема ответа для получения дерева категорий
export const getCategoryTreeResponseSchema = z.array(categoryTreeSchema);

// Схема входных данных для получения дочерних категорий
export const getChildrenByParentInputSchema = z.object({
  parentId: z.string().min(1, "ID родительской категории обязателен"),
}).optional();

// Схема ответа для получения дочерних категорий
export const getChildrenByParentResponseSchema = z.array(categorySchema);

// Схема входных данных для получения корневых категорий
export const getRootCategoriesInputSchema = z.object({
  includeInactive: z.boolean().optional().default(false),
}).optional();

// Схема ответа для получения корневых категорий
export const getRootCategoriesResponseSchema = z.array(categorySchema);

// Типы для удобства
export type Category = z.infer<typeof categorySchema>;
export type CategoryTree = z.infer<typeof categoryTreeSchema>;
export type CategoryImage = z.infer<typeof categoryImageSchema>;
export type GetCategoryBySlugInput = z.infer<typeof getCategoryBySlugInputSchema>;
export type GetCategoryBySlugResponse = z.infer<typeof getCategoryBySlugResponseSchema>;
export type GetAllCategoriesResponse = z.infer<typeof getAllCategoriesResponseSchema>;
export type GetCategoryTreeResponse = z.infer<typeof getCategoryTreeResponseSchema>;
export type GetChildrenByParentInput = z.infer<typeof getChildrenByParentInputSchema>;
export type GetChildrenByParentResponse = z.infer<typeof getChildrenByParentResponseSchema>;
export type GetRootCategoriesInput = z.infer<typeof getRootCategoriesInputSchema>;
export type GetRootCategoriesResponse = z.infer<typeof getRootCategoriesResponseSchema>;
