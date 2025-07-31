import { z } from "zod";

// Схема создания атрибута продукта
export const createProductAttributeSchema = z.object({
  name: z.string().min(2, { error: "Название атрибута должно содержать минимум 2 символа" }),
  description: z.string().optional(),
  type: z.enum(["text", "number", "boolean", "select", "multiselect"], {
    error: "Выберите корректный тип атрибута"
  }),
  isRequired: z.boolean().default(false),
  isFilterable: z.boolean().default(false),
  isSearchable: z.boolean().default(false),
  defaultValue: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
  options: z.array(z.string()).default([]).optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().default(true),
  productTypeId: z.string().min(1, { error: "Необходимо указать тип продукта" }),
});

export type CreateProductAttributeSchema = z.infer<
  typeof createProductAttributeSchema
>;

// Схема обновления атрибута продукта
export const updateProductAttributeSchema = createProductAttributeSchema.partial().extend({
  id: z.string().min(1, { error: "Идентификатор атрибута обязателен" }),
});

export type UpdateProductAttributeSchema = z.infer<
  typeof updateProductAttributeSchema
>;

// Схема удаления атрибута продукта (по id)
export const deleteProductAttributeSchema = z.object({
  id: z.string().min(1, { error: "Идентификатор атрибута обязателен" }),
});

export type DeleteProductAttributeSchema = z.infer<
  typeof deleteProductAttributeSchema
>;

// Схема для получения атрибутов по типу продукта
export const getAttributesByProductTypeSchema = z.object({
  productTypeId: z.string().min(1, { error: "Идентификатор типа продукта обязателен" }),
});

export type GetAttributesByProductTypeSchema = z.infer<
  typeof getAttributesByProductTypeSchema
>;
