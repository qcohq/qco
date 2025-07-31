import { z } from "zod";

// Схема для получения баннеров по позиции
export const getBannersByPositionSchema = z.object({
  position: z.string().min(1, "Position is required"),
  page: z.string().optional(),
  categorySlug: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10),
});

// Схема для получения активных баннеров
export const getActiveBannersSchema = z.object({
  position: z.string().optional(),
  page: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10),
});

// Схема для баннера с файлами (соответствует таблице banners)
export const bannerWithFilesSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  buttonText: z.string().nullable(),
  buttonLink: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number(),
  position: z.string(),
  page: z.string().nullable(),
  categoryId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  files: z.array(z.object({
    id: z.string(),
    bannerId: z.string(),
    fileId: z.string(),
    type: z.string(),
    order: z.number(),
    createdAt: z.date(),
    file: z.object({
      id: z.string(),
      url: z.string(),
      filename: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }),
  })),
});

// Схема для списка баннеров
export const bannersListSchema = z.array(bannerWithFilesSchema);

// Типы для TypeScript
export type GetBannersByPositionInput = z.infer<typeof getBannersByPositionSchema>;
export type GetActiveBannersInput = z.infer<typeof getActiveBannersSchema>;
export type BannerWithFiles = z.infer<typeof bannerWithFilesSchema>;
export type BannersList = z.infer<typeof bannersListSchema>; 
