import { z } from "zod";

// Схема для атрибута категории
export const categoryAttributeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    options: z.array(z.string()),
    isFilterable: z.boolean(),
    sortOrder: z.number(),
    isRequired: z.boolean(),
    isActive: z.boolean(),
});

// Схема для входных данных получения атрибутов по категории
export const getAttributesByCategoryInputSchema = z.object({
    categorySlug: z.string().min(1, "Category slug is required"),
});

// Схема для ответа с атрибутами категории
export const getAttributesByCategoryResponseSchema = z.array(categoryAttributeSchema);

// Типы TypeScript
export type CategoryAttribute = z.infer<typeof categoryAttributeSchema>;
export type GetAttributesByCategoryInput = z.infer<typeof getAttributesByCategoryInputSchema>;
export type GetAttributesByCategoryResponse = z.infer<typeof getAttributesByCategoryResponseSchema>; 