import { z } from "zod";

// Zod схема для валидации изображения продукта
export const colorImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  color: z.string().min(1, "Color is required"),
  isDefault: z.boolean().optional(),
});

// Zod схема для валидации файла продукта
export const productFileSchema = z.object({
  id: z.string(),
  url: z.string().url("Invalid file URL"),
  color: z.string().optional(),
  type: z.string().optional(),
  order: z.number().optional(),
});

// Zod схема для валидации пропсов компонента галереи
export const productGallerySchema = z.object({
  images: z.array(colorImageSchema).min(1, "At least one image is required"),
  productName: z.string().min(1, "Product name is required"),
});

// Zod схема для валидации пропсов компонента деталей продукта
export const productDetailsSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string().min(1, "Product name is required"),
    slug: z.string(),
    description: z.string().nullable(),
    basePrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    discountPercent: z.number().nullable(),
    stock: z.number().nullable(),
    sku: z.string().nullable(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    isPopular: z.boolean(),
    isNew: z.boolean(),
    hasVariants: z.boolean(),
    files: z.array(productFileSchema).optional(),
    brandId: z.string().nullable(),
    productTypeId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    seoTitle: z.string().nullable(),
    seoUrl: z.string().nullable(),
    seoDescription: z.string().nullable(),
    seoKeywords: z.string().nullable(),
    xmlId: z.string().nullable(),
  }),
});

// Экспорт типов, выведенных из Zod схем
export type ColorImage = z.infer<typeof colorImageSchema>;
export type ProductFile = z.infer<typeof productFileSchema>;
export type ProductGalleryProps = z.infer<typeof productGallerySchema>;
export type ProductDetailsProps = z.infer<typeof productDetailsSchema>;

// Импорт типа для формы редактирования из валидаторов
export type { ProductEditFormData } from "@qco/validators";
