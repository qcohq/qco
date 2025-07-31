import { z } from "zod";

// Схема для файла бренда (соответствует таблице brandFiles)
export const brandFileSchema = z.object({
  id: z.string(),
  brandId: z.string(),
  fileId: z.string(),
  type: z.string(),
  order: z.number(),
  createdAt: z.date(),
  file: z.object({
    id: z.string(),
    path: z.string(),
    name: z.string(),
    mimeType: z.string(),
    size: z.number(),
  }),
});

// Схема для получения бренда по slug
export const getBrandBySlugSchema = z.object({
  slug: z.string().min(1, "Brand slug is required"),
});

// Схема для бренда в списке избранных брендов (соответствует таблице brands)
export const featuredBrandSchema = z.object({
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
  logo: z.string().nullable(), // Дополнительное поле для фронтенда
});

// Схема для списка избранных брендов
export const featuredBrandsListSchema = z.array(featuredBrandSchema);

// Схема для бренда в общем списке (соответствует таблице brands)
export const brandListItemSchema = z.object({
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
  logo: z.string().nullable(), // Дополнительное поле для фронтенда
  productsCount: z.number().optional(),
});

// Схема для списка всех брендов
export const brandsListSchema = z.array(brandListItemSchema);

// Схема для бренда в детальном представлении (соответствует таблице brands)
export const brandDetailSchema = z.object({
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
  logo: z.string().nullable(), // Дополнительное поле для фронтенда
  banner: z.string().nullable(), // Дополнительное поле для фронтенда
  productsCount: z.number().optional(),
});

// Схема для детального бренда с файлами (соответствует таблице brands)
export const brandDetailWithFilesSchema = z.object({
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
  files: z.array(brandFileSchema).optional(),
});

// Схема для бренда с файлами (для внутреннего использования в API)
export const brandWithFilesSchema = z.object({
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
  files: z.array(brandFileSchema),
});

// Схема для входных параметров getAllBrands
export const getAllBrandsInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(["name", "createdAt", "isFeatured"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
}).optional();

// Схема для пагинации
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

// Схема для ответа getAllBrands
export const getAllBrandsResponseSchema = z.object({
  brands: z.array(brandListItemSchema),
  pagination: paginationSchema,
});

// Схема для бренда в алфавитном списке
export const alphabeticalBrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  countryOfOrigin: z.string().nullable(),
  isFeatured: z.boolean(),
});

// Схема для входных параметров getBrandsAlphabetical
export const getBrandsAlphabeticalInputSchema = z.object({
  categorySlug: z.string().optional(),
  limit: z.number().min(1).max(1000).default(1000),
});

// Схема для ответа getBrandsAlphabetical
export const getBrandsAlphabeticalResponseSchema = z.object({
  groupedBrands: z.record(z.string(), z.array(alphabeticalBrandSchema)),
  availableLetters: z.array(z.string()),
  totalBrands: z.number(),
});

// Типы на основе схем
export type BrandFile = z.infer<typeof brandFileSchema>;
export type GetBrandBySlugInput = z.infer<typeof getBrandBySlugSchema>;
export type FeaturedBrand = z.infer<typeof featuredBrandSchema>;
export type FeaturedBrandsList = z.infer<typeof featuredBrandsListSchema>;
export type BrandListItem = z.infer<typeof brandListItemSchema>;
export type BrandsList = z.infer<typeof brandsListSchema>;
export type BrandDetail = z.infer<typeof brandDetailSchema>;
export type BrandDetailWithFiles = z.infer<typeof brandDetailWithFilesSchema>;
export type BrandWithFiles = z.infer<typeof brandWithFilesSchema>;
export type GetAllBrandsInput = z.infer<typeof getAllBrandsInputSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type GetAllBrandsResponse = z.infer<typeof getAllBrandsResponseSchema>;
export type AlphabeticalBrand = z.infer<typeof alphabeticalBrandSchema>;
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

export type GetBrandsAlphabeticalInput = z.infer<typeof getBrandsAlphabeticalInputSchema>;
export type GetBrandsAlphabeticalResponse = z.infer<typeof getBrandsAlphabeticalResponseSchema>;
export type GetBrandFiltersInput = z.infer<typeof getBrandFiltersInputSchema>;
export type GetBrandFiltersResponse = z.infer<typeof getBrandFiltersResponseSchema>; 
