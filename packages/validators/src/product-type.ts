import { z } from "zod";

// Схема для типа продукта
export const productTypeSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Название обязательно"),
    slug: z.string().min(1, "Slug обязателен"),
    description: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Схема для значения атрибута
export const productAttributeValueSchema = z.object({
    id: z.string(),
    productId: z.string(),
    attributeId: z.string(),
    value: z.string().min(1, "Значение обязательно"),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Схемы для создания
export const createProductTypeSchema = productTypeSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

export const createProductAttributeValueSchema = productAttributeValueSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

// Схемы для обновления
export const updateProductTypeSchema = createProductTypeSchema.partial().extend({
    id: z.string(),
});

export const updateProductAttributeValueSchema = createProductAttributeValueSchema.partial().extend({
    id: z.string(),
});

// Схемы для upsert (создание или обновление)
export const upsertProductAttributeValueSchema = z.object({
    productId: z.string().min(1, "ID товара обязателен"),
    attributeId: z.string().min(1, "ID атрибута обязателен"),
    value: z.string().min(1, "Значение обязательно"),
});

// Схема для ответа upsert операции
export const upsertProductAttributeValueResponseSchema = z.object({
    id: z.string(),
    productId: z.string(),
    attributeId: z.string(),
    value: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Схемы для удаления
export const deleteProductTypeSchema = z.object({
    id: z.string().min(1, "ID обязателен"),
});

export const deleteProductAttributeValueSchema = z.object({
    id: z.string().min(1, "ID обязателен"),
});

// Схемы для получения
export const getProductTypeByIdSchema = z.object({
    id: z.string().min(1, "ID обязателен"),
});

export const getProductAttributeValuesByProductIdSchema = z.object({
    productId: z.string().min(1, "ID товара обязателен"),
});

// Типы
export type ProductType = z.infer<typeof productTypeSchema>;
export type ProductAttributeValue = z.infer<typeof productAttributeValueSchema>;
export type CreateProductType = z.infer<typeof createProductTypeSchema>;
export type CreateProductAttributeValue = z.infer<typeof createProductAttributeValueSchema>;
export type UpdateProductType = z.infer<typeof updateProductTypeSchema>;
export type UpdateProductAttributeValue = z.infer<typeof updateProductAttributeValueSchema>;
export type UpsertProductAttributeValue = z.infer<typeof upsertProductAttributeValueSchema>;
export type UpsertProductAttributeValueResponse = z.infer<typeof upsertProductAttributeValueResponseSchema>;
export type DeleteProductType = z.infer<typeof deleteProductTypeSchema>;
export type DeleteProductAttributeValue = z.infer<typeof deleteProductAttributeValueSchema>;
export type GetProductTypeById = z.infer<typeof getProductTypeByIdSchema>;
export type GetProductAttributeValuesByProductId = z.infer<typeof getProductAttributeValuesByProductIdSchema>; 