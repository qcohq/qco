import type { z } from "zod";

// Создаем Zod схему для FilterState
const filterStateSchema = z.object({
  search: z.string(),
  category: z.string(),
  status: z.string(),
  inStock: z.boolean(),
  onSale: z.boolean(),
  categories: z.array(z.string()),
  brands: z.array(z.string()),
  priceRange: z.tuple([z.number(), z.number()]),
  minPrice: z.number(),
  maxPrice: z.number(),
});

// Выводим тип из Zod схемы
export type FilterState = z.infer<typeof filterStateSchema>;

// Экспортируем схему для использования в других местах
export { filterStateSchema };
