import type { TRPCRouterRecord } from "@trpc/server";
import { search } from "./search";
import { autocomplete } from "./autocomplete";
import { getPopularSearches } from "./get-popular-searches";
import { getCategories } from "./get-categories";
import { getBrands } from "./get-brands";

export const searchRouter = {
    search,
    autocomplete,
    getPopularSearches,
    getCategories,
    getBrands,
} satisfies TRPCRouterRecord; 