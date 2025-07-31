import { z } from "zod";

// Схема для поискового запроса
export const searchQuerySchema = z.object({
    q: z.string().min(1, "Search query is required").max(100, "Search query too long"),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sortBy: z.enum(["relevance", "price_asc", "price_desc", "newest", "popular"]).optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(50).optional(),
});

// Схема для результатов поиска
export const searchResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    brand: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
    price: z.number(),
    originalPrice: z.number().optional(),
    discount: z.number().optional(),
    image: z.string().optional(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
    isNew: z.boolean().optional(),
    isSale: z.boolean().optional(),
});

// Схема для ответа поиска
export const searchResponseSchema = z.object({
    products: z.array(searchResultSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
});

// Схема для популярных поисковых запросов
export const popularSearchSchema = z.object({
    query: z.string(),
    count: z.number(),
});

// Схема для автодополнения
export const autocompleteSchema = z.object({
    suggestions: z.array(z.object({
        type: z.enum(["product", "brand", "category"]),
        text: z.string(),
        value: z.string(),
        count: z.number().optional(),
    })),
});

// Типы для TypeScript
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type PopularSearch = z.infer<typeof popularSearchSchema>;
export type AutocompleteResult = z.infer<typeof autocompleteSchema>; 