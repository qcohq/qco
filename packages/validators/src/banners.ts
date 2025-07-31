import { z } from "zod";

// Базовые сообщения об ошибках
const errorMessages = {
  required: (field: string) => `${field} обязателен`,
  minLength: (field: string, min: number) => `${field} должен содержать минимум ${min} символов`,
  maxLength: (field: string, max: number) => `${field} не должен превышать ${max} символов`,
  url: "Некорректный URL",
  email: "Пожалуйста, введите корректный адрес электронной почты",
  number: {
    min: (field: string, min: number) => `${field} должен быть не меньше ${min}`,
    max: (field: string, max: number) => `${field} не должен превышать ${max}`,
  },
};

// Схема для файла баннера (соответствует схеме БД)
export const bannerFileSchema = z.object({
  fileId: z.string().min(1, errorMessages.required("ID файла")),
  type: z.string().min(1, errorMessages.required("Тип файла")),
  order: z.number().min(0, errorMessages.number.min("Порядок", 0)).default(0),
  // Метаданные файла (опционально)
  meta: z.object({
    name: z.string().optional(),
    mimeType: z.string().optional(),
    size: z.number().optional(),
  }).optional(),
});

// Схема для формы создания баннера (фронтенд)
export const bannerFormSchema = z.object({
  title: z.string().min(1, errorMessages.required("Название баннера")),
  description: z.string().optional(),
  link: z.string().url(errorMessages.url).optional().or(z.literal("")),
  linkText: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  position: z.string().min(1, errorMessages.required("Позиция")),
  page: z.string().optional().or(z.literal("")), // Используем page везде
  sortOrder: z.number().min(0, errorMessages.number.min("Порядок сортировки", 0)).default(0),
  categoryId: z.string().optional().or(z.literal("")),
  files: z.array(z.object({
    fileId: z.string(),
    type: z.string(),
    order: z.number(),
    meta: z.object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  })).default([]),
  isUploading: z.boolean().optional(),
}).refine((data) => {
  // Если указана ссылка, то должен быть указан текст кнопки
  if (data.link && !data.linkText) {
    return false;
  }
  return true;
}, {
  error: "Если указана ссылка, то текст кнопки обязателен",
  path: ["linkText"],
}).refine((data) => {
  // Если указан текст кнопки, то должна быть указана ссылка
  if (data.linkText && !data.link) {
    return false;
  }
  return true;
}, {
  error: "Если указан текст кнопки, то ссылка обязательна",
  path: ["link"],
});

// Схема для формы редактирования баннера (фронтенд)
export const bannerEditFormSchema = z.object({
  title: z.string().min(1, errorMessages.required("Название баннера")),
  description: z.string().optional(),
  link: z.string().optional().or(z.literal("")).refine((val) => {
    if (val === "" || !val) return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: "Введите корректный URL",
  }),
  linkText: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  position: z.string().min(1, errorMessages.required("Позиция")),
  page: z.string().optional().or(z.literal("")), // Используем page везде
  sortOrder: z.number().min(0, errorMessages.number.min("Порядок сортировки", 0)).default(0),
  categoryId: z.string().optional().or(z.literal("")),
  files: z.array(z.object({
    fileId: z.string(),
    type: z.string(),
    order: z.number(),
    meta: z.object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  })).default([]),
  id: z.string().optional(),
}).refine((data) => {
  // Если указана ссылка, то должен быть указан текст кнопки
  if (data.link && data.link.trim() !== "" && !data.linkText) {
    return false;
  }
  return true;
}, {
  error: "Если указана ссылка, то текст кнопки обязателен",
  path: ["linkText"],
}).refine((data) => {
  // Если указан текст кнопки, то должна быть указана ссылка
  if (data.linkText && data.linkText.trim() !== "" && !data.link) {
    return false;
  }
  return true;
}, {
  error: "Если указан текст кнопки, то ссылка обязательна",
  path: ["link"],
});

// Схема для создания баннера (API)
export const createBannerSchema = z.object({
  title: z.string().min(1, errorMessages.required("Название")),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  position: z.string().min(1, errorMessages.required("Позиция")),
  page: z.string().optional().or(z.literal("")), // Соответствует полю в БД
  categoryId: z.string().optional().or(z.literal("")),
  files: z.array(z.object({
    fileId: z.string(),
    type: z.string(),
    order: z.number(),
    meta: z.object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  })).default([]),
});

// Схема для обновления баннера (API)
export const updateBannerSchema = z.object({
  id: z.string().min(1, errorMessages.required("ID баннера")),
  title: z.string().min(1, errorMessages.required("Название")).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  position: z.string().min(1, errorMessages.required("Позиция")).optional(),
  page: z.string().optional().or(z.literal("")), // Соответствует полю в БД
  categoryId: z.string().optional().or(z.literal("")),
  files: z.array(z.object({
    fileId: z.string(),
    type: z.string(),
    order: z.number(),
    meta: z.object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  })).default([]),
});

// Схема для получения баннеров с фильтрацией
export const getBannersSchema = z.object({
  page: z.number().min(1, errorMessages.number.min("Страница", 1)).default(1),
  limit: z.number().min(1, errorMessages.number.min("Лимит", 1)).max(100, errorMessages.number.max("Лимит", 100)).default(20),
  search: z.string().optional(),
  position: z.string().optional(),
  pageFilter: z.string().optional(), // Переименовал section в pageFilter для ясности
  isActive: z.boolean().optional(),
  sortBy: z.enum(["title", "position", "sortOrder", "createdAt"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Схема для добавления файла к баннеру
export const addBannerFileSchema = z.object({
  bannerId: z.string().min(1, errorMessages.required("ID баннера")),
  file: z.object({
    fileId: z.string().min(1, errorMessages.required("ID файла")),
    type: z.string().min(1, errorMessages.required("Тип файла")),
    order: z.number().min(0, errorMessages.number.min("Порядок", 0)).default(0),
    meta: z.object({
      name: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  }),
});

// Схема для удаления файла баннера
export const removeBannerFileSchema = z.object({
  bannerId: z.string().min(1, errorMessages.required("ID баннера")),
  fileId: z.string().min(1, errorMessages.required("ID файла")),
});

// Схема для обновления порядка файлов баннера
export const updateBannerFilesOrderSchema = z.object({
  bannerId: z.string().min(1, errorMessages.required("ID баннера")),
  fileOrders: z.array(z.object({
    fileId: z.string().min(1, errorMessages.required("ID файла")),
    order: z.number().min(0, errorMessages.number.min("Порядок", 0)),
  })).min(1, "Необходимо указать хотя бы один файл"),
});

// Схема для удаления баннера
export const deleteBannerSchema = z.object({
  id: z.string().min(1, errorMessages.required("ID баннера")),
});

// Схема для массового удаления баннеров
export const bulkDeleteBannersSchema = z.object({
  ids: z.array(z.string().min(1, errorMessages.required("ID баннера"))).min(1, "Необходимо выбрать хотя бы один баннер"),
});

// Схема для получения баннера по ID
export const getBannerByIdSchema = z.object({
  id: z.string().min(1, errorMessages.required("ID баннера")),
});

// Типы для экспорта
export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type GetBannersInput = z.infer<typeof getBannersSchema>;
export type AddBannerFileInput = z.infer<typeof addBannerFileSchema>;
export type RemoveBannerFileInput = z.infer<typeof removeBannerFileSchema>;
export type UpdateBannerFilesOrderInput = z.infer<typeof updateBannerFilesOrderSchema>;
export type DeleteBannerInput = z.infer<typeof deleteBannerSchema>;
export type BulkDeleteBannersInput = z.infer<typeof bulkDeleteBannersSchema>;
export type GetBannerByIdInput = z.infer<typeof getBannerByIdSchema>;
export type BannerFileInput = z.infer<typeof bannerFileSchema>;
export type BannerFormData = z.infer<typeof bannerFormSchema>;
export type BannerEditFormData = z.infer<typeof bannerEditFormSchema>; 
