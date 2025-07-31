import { z } from "zod";

// Схема входных данных для динамических фильтров
// export const getDynamicCategoryFiltersSchema = z.object({
//     categorySlug: z.string(),
//     // Текущие фильтры, которые уже применены
//     appliedFilters: z.object({
//         brands: z.array(z.string()).optional(),
//         priceRange: z.tuple([z.number(), z.number()]).optional(),
//         sizes: z.array(z.string()).optional(),
//         colors: z.array(z.string()).optional(),
//         inStock: z.boolean().optional(),
//         onSale: z.boolean().optional(),
//         attributes: z.record(z.array(z.string())).optional(),
//     }).optional(),
// });

// Типы для динамических фильтров
// export type GetDynamicCategoryFiltersInput = {
//     categorySlug: string;
//     appliedFilters?: {
//         brands?: string[];
//         priceRange?: [number, number];
//         sizes?: string[];
//         colors?: string[];
//         inStock?: boolean;
//         onSale?: boolean;
//         attributes?: Record<string, string[]>;
//     };
// }; 