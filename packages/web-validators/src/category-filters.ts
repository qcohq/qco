import { z } from "zod";

// Схема входных данных для получения фильтров по категории
export const getCategoryFiltersSchema = z.object({
    categorySlug: z.string().min(1, "Category slug is required"),
});

// Схема для элемента фильтра с количеством
const filterItemSchema = z.object({
    name: z.string(),
    count: z.number(),
});

// Схема ответа с доступными фильтрами
export const getCategoryFiltersResponseSchema = z.object({
    sizes: z.array(filterItemSchema),
    colors: z.array(filterItemSchema),
    brands: z.array(filterItemSchema),
    priceRange: z.object({
        min: z.number(),
        max: z.number(),
    }),
    totalProducts: z.number(),
    inStock: z.boolean().optional(),
    attributes: z.record(z.string(), z.object({
        name: z.string(),
        values: z.array(filterItemSchema),
    })).optional(),
});

// Типы для TypeScript
export type GetCategoryFiltersInput = z.infer<typeof getCategoryFiltersSchema>;
export type GetCategoryFiltersResponse = z.infer<typeof getCategoryFiltersResponseSchema>; 