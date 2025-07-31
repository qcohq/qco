import { z } from "zod";

// Схема для валидации формы категории
export const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, { error: "Название должно содержать минимум 2 символа" })
    .max(255, { error: "Название не должно превышать 255 символов" }),
  slug: z
    .string()
    .min(1, { error: "Slug обязателен" })
    .regex(/^[a-z0-9-]+$/, {
      error: "Slug должен содержать только строчные буквы, цифры и дефисы",
    }),
  xmlId: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")).nullable(),
  productTypeIds: z.array(z.string()).optional().default([]),
  image: z.object({
    fileId: z.string(),
    url: z.string().optional(),
    meta: z.object({
      name: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }).optional(),
  }).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z
    .string()
    .max(70, { error: "Meta заголовок не должен превышать 70 символов" })
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, { error: "Meta описание не должно превышать 160 символов" })
    .optional()
    .or(z.literal("")),
  metaKeywords: z
    .string()
    .max(255, { error: "Meta ключевые слова не должны превышать 255 символов" })
    .optional()
    .or(z.literal("")),
});

// Рекурсивная схема для узла дерева категорий
export const categoryTreeNodeSchema: z.ZodType<CategoryTreeNode> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().nullable(),
  parentId: z.string().nullable(),
  children: z.array(categoryTreeNodeSchema),
}));

// Схема для узла дерева категорий с дочерними элементами (используется в get-children)
export const categoryChildNodeSchema: z.ZodType<CategoryChildNode> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().nullable(),
  parentId: z.string().nullable(),
  children: z.array(categoryChildNodeSchema),
}));

// Схема для папочного представления категорий с количеством дочерних элементов
export const categoryFolderNodeSchema: z.ZodType<CategoryFolderNode> = z.lazy(() => z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().nullable(),
  parentId: z.string().nullable(),
  children: z.array(categoryFolderNodeSchema),
  childrenCount: z.number(),
}));

// Схемы для API роутеров
export const getCategoryTreeSchema = z.object({
  isActive: z.boolean().optional(),
}).optional().default({});

export const checkSlugSchema = z.object({
  slug: z.string().min(1, "URL категории обязателен"),
  excludeId: z.string().optional(), // ID категории для исключения при редактировании
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  slug: z
    .string()
    .min(1, "URL обязателен")
    .regex(/^[a-z0-9-]+$/, {
      message: "URL должен содержать только строчные буквы, цифры и дефисы",
    }),
  xmlId: z.string().optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  parentId: z.string().optional().nullable().transform((val) => val === "" ? null : val),
  productTypeIds: z.array(z.string()).optional().default([]),
  imageId: z.string().optional().nullable(),
  // Поддержка загрузки файла через presigned URL
  image: z.object({
    fileId: z.string(),
    url: z.string().optional(),
    meta: z.object({
      name: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }).optional(),
  }).optional().nullable(),
});

export const deleteCategorySchema = z.object({
  id: z.string(),
});

export const generateUniqueSlugSchema = z.object({
  baseSlug: z.string().min(1, "Базовый URL обязателен"),
  excludeId: z.string().optional().nullable(), // ID категории для исключения при редактировании
});

export const getByIdSchema = z.object({
  id: z.string(),
});

export const getChildrenSchema = z.object({
  parentId: z.string().nullable(),
  isActive: z.boolean().optional(),
});

export const getFolderViewSchema = z.object({
  parentId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const listCategoriesSchema = z
  .object({
    page: z.number().default(1),
    limit: z.number().default(12),
    search: z.string().optional(),
  })
  .default(() => ({
    page: 1,
    limit: 12,
    search: "",
  }));

export const updateCategoryOrderSchema = z.object({
  categoryId: z.string(),
  newOrder: z.number(),
});

export const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  slug: z.string().optional(),
  xmlId: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  parentId: z.string().optional().nullable().transform((val) => val === "" ? null : val),
  productTypeIds: z.array(z.string()).optional().default([]),
  imageId: z.string().optional().nullable(),
  // Поддержка загрузки файла через presigned URL
  image: z.object({
    fileId: z.string(),
    url: z.string().optional(),
    meta: z.object({
      name: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }).optional(),
  }).optional().nullable(),
});

// Типы данных
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  children: CategoryTreeNode[];
}

export interface CategoryChildNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  children: CategoryChildNode[];
}

export interface CategoryFolderNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number | null;
  parentId: string | null;
  children: CategoryFolderNode[];
  childrenCount: number;
}
