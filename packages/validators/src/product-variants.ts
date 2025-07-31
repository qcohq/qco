import { z } from "zod";

// ====== СХЕМЫ ДЛЯ АТРИБУТОВ И ВАРИАНТОВ ПРОДУКТОВ ======

// Схема для атрибута продукта
export const productAttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  productId: z.string(),
  required: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  values: z.array(z.object({
    id: z.string(),
    attributeId: z.string(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })),
});

// Схема для варианта продукта
export const productVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string().nullable(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  isDefault: z.boolean(),
  stock: z.number().nullable(),
  minStock: z.number().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  price: z.number().nullable(),
  salePrice: z.number().nullable(),
  costPrice: z.number().nullable(),
  weight: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  depth: z.number().nullable(),
  attributes: z.array(z.object({
    option: z.string(),
    value: z.string(),
  })),
});

// Схема для редактирования варианта
export const variantEditSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

// Схема для редактирования опции
export const optionEditSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
});

// Схема для значения опции
export const optionValueSchema = z.object({
  value: z.string().min(1, "Значение обязательно"),
  hex: z.string().optional(),
});

// Схема для массового редактирования цен
export const bulkPriceEditSchema = z.object({
  price: z.number().min(0).optional(),
  compareAtPrice: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
});

// Схема для массового редактирования наличия
export const bulkStockEditSchema = z.object({
  stock: z.number().int().min(0),
});

// Схема для генерации вариантов (базовая)
export const generateVariantsBaseSchema = z.object({
  productId: z.string(),
  optionIds: z.array(z.string()),
});

// ====== СХЕМЫ ДЛЯ ФОРМ ======

// Схема для валидации формы редактирования варианта
export const variantFormSchema = z.object({
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number()
  ]).pipe(
    z.number().min(0, "Цена не может быть отрицательной").optional()
  ),
  salePrice: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number(),
    z.null(),
    z.undefined()
  ]).transform((val) => {
    if (val === undefined || val === null) return val;
    return Number(val) >= 0 ? Number(val) : undefined;
  }).optional(),
  costPrice: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number(),
    z.null(),
    z.undefined()
  ]).transform((val) => {
    if (val === undefined || val === null) return val;
    return Number(val) >= 0 ? Number(val) : undefined;
  }).optional(),
  stock: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number()
  ]).pipe(
    z.number().int("Количество должно быть целым числом").min(0, "Количество не может быть отрицательным").optional()
  ),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Схема для создания опции варианта через API
export const createVariantOptionSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  values: z.array(z.string()).min(1, "Добавьте хотя бы одно значение"),
  productId: z.string().min(1, "ID продукта обязателен"),
  type: z.enum(["select", "color", "text", "number"]).default("select"),
  metadata: z.record(z.string(), z.any())
    .optional(),
});

// Схема для добавления значения опции варианта через API
export const addVariantOptionValueSchema = z.object({
  optionId: z.string().min(1, "ID опции обязателен"),
  value: z.string().min(1, "Значение обязательно"),
  displayName: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Схема для обновления опции варианта
export const updateVariantOptionSchema = z.object({
  id: z.string().min(1, "ID опции обязателен"),
  name: z.string().min(1, "Название опции обязательно").optional(),
  type: z.enum(["select", "color", "text", "number"]).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  sortOrder: z.number().min(0).optional(),
});

// Схема для обновления значения опции варианта
export const updateVariantOptionValueSchema = z.object({
  id: z.string().min(1, "ID значения обязателен"),
  value: z.string().min(1, "Значение обязательно").optional(),
  displayName: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  sortOrder: z.number().min(0).optional(),
});

// Схема для удаления опции варианта
export const deleteVariantOptionSchema = z.object({
  optionId: z.string().min(1, "ID опции обязателен"),
});

// Схема для удаления значения опции варианта
export const deleteVariantOptionValueSchema = z.object({
  valueId: z.string().min(1, "ID значения обязателен"),
});

// Схема для получения опций варианта
export const getVariantOptionsSchema = z.object({
  productId: z.string().min(1, "ID продукта обязателен"),
});

// Схема для генерации вариантов
export const generateVariantsSchema = z.object({
  productId: z.string().min(1, "ID продукта обязателен"),
  optionIds: z.array(z.string()).min(1, "Выберите хотя бы одну опцию"),
});

// Схема для предпросмотра вариантов
export const previewVariantsSchema = z.object({
  productId: z.string().min(1, "ID продукта обязателен"),
  optionIds: z.array(z.string()).min(1, "Выберите хотя бы одну опцию"),
});

// Схема для дублирования варианта
export const duplicateVariantSchema = z.object({
  variantId: z.string().min(1, "ID варианта обязателен"),
  productId: z.string().min(1, "ID продукта обязателен"),
});

// ====== СТАРЫЕ СХЕМЫ ДЛЯ ФОРМ (оставляем для совместимости) ======

// Схема для валидации формы создания опции
export const optionFormSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  values: z.union([
    z.string().min(1, "Добавьте хотя бы одно значение"),
    z.array(z.string()).min(1, "Добавьте хотя бы одно значение")
  ]).transform((val) => {
    // Если это массив, преобразуем в строку через запятую
    if (Array.isArray(val)) {
      return val.join(",");
    }
    // Если это строка, возвращаем как есть
    return val;
  }),
});

// Схема для формы (без трансформации)
export const optionFormInputSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
  values: z.array(z.string()).min(1, "Добавьте хотя бы одно значение"),
});

// Схема для валидации формы редактирования опции
export const optionEditFormSchema = z.object({
  name: z.string().min(1, "Название опции обязательно"),
});

// Схема для валидации формы добавления значения опции
export const valueFormSchema = z.object({
  value: z.string().min(1, "Введите значение"),
});

// ====== DEPRECATED SCHEMAS (для совместимости) ======

// @deprecated - используйте createVariantOptionSchema
export const createOptionSchema = createVariantOptionSchema;

// @deprecated - используйте addVariantOptionValueSchema
export const addOptionValueSchema = addVariantOptionValueSchema;

// Типы для экспорта
export type VariantFormValues = z.infer<typeof variantFormSchema>;

// Новые типы для опций вариантов
export type CreateVariantOptionValues = z.infer<typeof createVariantOptionSchema>;
export type AddVariantOptionValueValues = z.infer<typeof addVariantOptionValueSchema>;
export type UpdateVariantOptionValues = z.infer<typeof updateVariantOptionSchema>;
export type UpdateVariantOptionValueValues = z.infer<typeof updateVariantOptionValueSchema>;
export type DeleteVariantOptionValues = z.infer<typeof deleteVariantOptionSchema>;
export type DeleteVariantOptionValueValues = z.infer<typeof deleteVariantOptionValueSchema>;
export type GetVariantOptionsValues = z.infer<typeof getVariantOptionsSchema>;
export type GenerateVariantsValues = z.infer<typeof generateVariantsSchema>;
export type PreviewVariantsValues = z.infer<typeof previewVariantsSchema>;
export type DuplicateVariantValues = z.infer<typeof duplicateVariantSchema>;

// Старые типы для совместимости
export type CreateOptionValues = CreateVariantOptionValues;
export type AddOptionValueValues = AddVariantOptionValueValues;
export type OptionFormValues = z.infer<typeof optionFormSchema>;
export type OptionFormInputValues = z.infer<typeof optionFormInputSchema>;
export type OptionEditFormValues = z.infer<typeof optionEditFormSchema>;
export type ValueFormValues = z.infer<typeof valueFormSchema>;

// ====== ТИПЫ ДЛЯ АТРИБУТОВ И ВАРИАНТОВ ======

// Типы для атрибутов и вариантов продуктов
export type ProductAttribute = z.infer<typeof productAttributeSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type VariantEditData = z.infer<typeof variantEditSchema>;
export type OptionEditData = z.infer<typeof optionEditSchema>;
export type OptionValueData = z.infer<typeof optionValueSchema>;
export type BulkPriceEditData = z.infer<typeof bulkPriceEditSchema>;
export type BulkStockEditData = z.infer<typeof bulkStockEditSchema>;
export type GenerateVariantsData = z.infer<typeof generateVariantsBaseSchema>;
