import { z } from "zod";
import { productSpecificationSchema } from "./product-specification";

export const productFileSchema = z.object({
  fileId: z.string(),
  type: z.string().default("gallery"),
  order: z.number().nullish(),
  alt: z.string().optional(),
  meta: z
    .object({
      url: z.url().nullish(),
      name: z.string().nullish(),
      mimeType: z.string().nullish(),
      size: z.number().nullish(),
    })
    .nullish(),
});

export type ProductFileInput = z.infer<typeof productFileSchema>;

// Тип изображения продукта для фронта и бэка (расширяет productFileSchema)
export type ProductImage = z.infer<typeof productFileSchema> & {
  id: string;
  meta: { url: string | null };
};

export const productBaseSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Название продукта обязательно и должно содержать минимум 2 символа" })
    .max(255, { error: "Название продукта не может быть длиннее 255 символов" })
    .trim(),
  slug: z
    .string()
    .min(2, { error: "URL товара должен содержать минимум 2 символа" })
    .max(255, { error: "URL товара не может быть длиннее 255 символов" })
    .regex(/^[a-z0-9-]+$/, { error: "URL товара может содержать только латинские буквы, цифры и дефисы" })
    .trim()
    .optional(),
  description: z.string().max(2000, { error: "Описание не может быть длиннее 2000 символов" }).nullable().optional(),
  brandId: z
    .string()
    .cuid2({ error: "Некорректный ID бренда" })
    .nullable()
    .optional(),
  isActive: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  stock: z.number().int().min(0).optional(),
  sku: z.string()
    .max(100, { error: "Артикул не может быть длиннее 100 символов" })
    .regex(/^[a-zA-Z0-9\-_\s]*$/, { error: "Артикул может содержать только латинские буквы, цифры, дефисы, подчеркивания и пробелы" })
    .nullish()
    .transform((val) => val === "" ? null : val),
  basePrice: z.number()
    .min(0, { error: "Базовая цена должна быть не меньше 0" })
    .multipleOf(0.01, { error: "Базовая цена должна быть с точностью до копеек" })
    .optional(),
  salePrice: z.number()
    .min(0, { error: "Цена со скидкой должна быть не меньше 0" })
    .multipleOf(0.01, { error: "Цена со скидкой должна быть с точностью до копеек" })
    .nullable()
    .optional(),
  discountPercent: z.number()
    .min(0, { error: "Процент скидки не может быть отрицательным" })
    .max(100, { error: "Процент скидки не может превышать 100%" })
    .multipleOf(0.01, { error: "Процент скидки должен быть с точностью до сотых" })
    .optional(),
  hasVariants: z.boolean().default(false),
  productTypeId: z.string().min(1, { error: "Необходимо выбрать тип продукта" }),
  seoTitle: z.string().max(255, { error: "SEO заголовок не может быть длиннее 255 символов" }).optional(),
  seoUrl: z.string().max(255, { error: "SEO URL не может быть длиннее 255 символов" }).optional(),
  seoDescription: z.string().max(500, { error: "SEO описание не может быть длиннее 500 символов" }).optional(),
  seoKeywords: z.string().max(255, { error: "SEO ключевые слова не могут быть длиннее 255 символов" }).optional(),
  xmlId: z.string().max(255).optional(),
})
  .refine((data) => {
    if (data.salePrice && data.basePrice && data.salePrice >= data.basePrice) {
      return false;
    }
    return true;
  }, {
    error: "Цена со скидкой должна быть меньше базовой цены",
    path: ["salePrice"],
  })
  .refine((data) => {
    if (data.discountPercent && data.basePrice && data.salePrice) {
      const expectedSalePrice = data.basePrice * (1 - data.discountPercent / 100);
      const tolerance = 0.01;
      if (Math.abs(data.salePrice - expectedSalePrice) > tolerance) {
        return false;
      }
    }
    return true;
  }, {
    error: "Цена со скидкой не соответствует указанному проценту скидки",
    path: ["salePrice"],
  });

export const productCreateSchema = productBaseSchema.and(z.object({
  files: z.array(productFileSchema).optional(),
  categories: z.array(z.union([z.string(), z.object({ id: z.string(), name: z.string() })])).optional(),
}));

export const productUpdateSchema = productBaseSchema.and(z.object({
  id: z.cuid2(),
  categories: z.array(z.union([z.string(), z.object({ id: z.string(), name: z.string() })])).optional(),
}));

// Схема для редактирования продукта в форме (упрощенная версия для UI)
export const productEditFormSchema = z.object({
  name: z.string().min(2, { message: "Product name must contain at least 2 characters" }),
  description: z.string().optional(),
  basePrice: z.number().min(0, { message: "Base price must be non-negative" }).optional(),
  salePrice: z.number().min(0, { message: "Sale price must be non-negative" }).optional(),
  stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }).optional(),
  sku: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isPopular: z.boolean(),
  isNew: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
}).refine((data) => {
  if (data.salePrice && data.basePrice && data.salePrice >= data.basePrice) {
    return false;
  }
  return true;
}, {
  message: "Sale price must be less than base price",
  path: ["salePrice"],
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductEditFormData = z.infer<typeof productEditFormSchema>;
