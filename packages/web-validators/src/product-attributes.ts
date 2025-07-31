import { z } from "zod";

// Схема для атрибута продукта
export const productAttributeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    value: z.string(),
    options: z.array(z.string()).optional(),
});

// Схема входных данных для получения атрибутов продукта
export const getProductAttributesInputSchema = z.object({
    slug: z.string().min(1, "Product slug is required"),
});

// Схема ответа для получения атрибутов продукта
export const getProductAttributesResponseSchema = z.array(productAttributeSchema);

// Типы для TypeScript
export type ProductAttribute = z.infer<typeof productAttributeSchema>;
export type GetProductAttributesInput = z.infer<typeof getProductAttributesInputSchema>;
export type GetProductAttributesResponse = z.infer<typeof getProductAttributesResponseSchema>; 