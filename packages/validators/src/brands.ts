import { z } from "zod";

// Схема валидации для файла бренда
export const brandFileSchema = z.object({
  fileId: z.string(),
  type: z.string(),
  order: z.number().optional(),
  meta: z
    .object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
      url: z.string().optional(),
    })
    .optional(),
});

// Схема для категории бренда
export const brandCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parentId: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  xmlId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для файла бренда с деталями
export const brandFileDetailSchema = z.object({
  id: z.string(),
  brandId: z.string(),
  fileId: z.string(),
  type: z.string(),
  order: z.number().nullable(),
  createdAt: z.date(),
  file: z.object({
    id: z.string(),
    path: z.string(),
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
  url: z.string().nullable(),
});

// Универсальная схема бренда (используется и для фронта, и для бэка)
export const brandSchema = z.object({
  name: z.string().min(2, "Название обязательно").max(255),
  slug: z.string().min(2, "Слаг обязателен").max(255),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  website: z.string().optional(),
  email: z.email({ message: "Некорректный email" }).optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  foundedYear: z.string().max(10).optional(),
  countryOfOrigin: z.string().max(255).optional(),
  brandColor: z.string().max(7).optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(), // ID категорий первого уровня
  // Поля для файлов (используются в форме)
  logoKey: z.string().nullable().optional(),
  logoMeta: z
    .object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
      url: z.string().optional(),
    })
    .optional(),
  bannerKey: z.string().nullable().optional(),
  bannerMeta: z
    .object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
      url: z.string().optional(),
    })
    .optional(),
});

// Схема валидации для создания бренда
export const createBrandSchema = brandSchema.extend({
  files: z.array(brandFileSchema).optional(),
});

// Схема валидации для обновления бренда
export const updateBrandSchema = createBrandSchema.partial().extend({
  id: z.string(),
});

// Схема для получения всех брендов
export const getAllBrandsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt", "isActive", "isFeatured"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Схема для получения бренда по ID
export const getBrandByIdSchema = z.object({
  id: z.string(),
});

// Схема для бренда с категориями и файлами
export const brandWithRelationsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  shortDescription: z.string().nullable(),
  website: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  foundedYear: z.string().nullable(),
  countryOfOrigin: z.string().nullable(),
  brandColor: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.array(z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  categories: z.array(brandCategorySchema).optional(),
  files: z.array(brandFileDetailSchema).optional(),
});

// Схема для ответа при создании бренда (только необходимые поля)
export const createBrandResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Схема для ответа при обновлении бренда (только необходимые поля)
export const updateBrandResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Схема для списка брендов
export const brandsListSchema = z.object({
  items: z.array(brandWithRelationsSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pageCount: z.number(),
  }),
});

// Схема для входных параметров getBrandFilters
export const getBrandFiltersInputSchema = z.object({
  brandSlug: z.string().min(1, "Slug бренда обязателен"),
});

// Схема для ответа getBrandFilters
export const getBrandFiltersResponseSchema = z.object({
  sizes: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })),
  colors: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  totalProducts: z.number(),
  attributes: z.record(z.string(), z.object({
    name: z.string(),
    values: z.array(z.object({
      name: z.string(),
      count: z.number(),
    })),
  })),
});

// Типы данных на основе схем
export type BrandFormValues = z.infer<typeof brandSchema> & {
  files?: z.infer<typeof brandFileSchema>[];
  logoMeta?: { name?: string; mimeType?: string; size?: number; url?: string };
  bannerMeta?: { name?: string; mimeType?: string; size?: number; url?: string };
};

export type BrandFileInput = z.infer<typeof brandFileSchema>;
export type BrandWithRelations = z.infer<typeof brandWithRelationsSchema>;
export type CreateBrandResponse = z.infer<typeof createBrandResponseSchema>;
export type UpdateBrandResponse = z.infer<typeof updateBrandResponseSchema>;
export type BrandsListResponse = z.infer<typeof brandsListSchema>;
export type GetBrandFiltersInput = z.infer<typeof getBrandFiltersInputSchema>;
export type GetBrandFiltersResponse = z.infer<typeof getBrandFiltersResponseSchema>;
