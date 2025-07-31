import type { TRPCRouterRecord } from "@trpc/server";
import { getByCategory } from "./get-by-category";
import { getBySlug } from "./get-by-slug";
import { getCategoryHierarchy } from "./get-category-hierarchy";
import { getFeatured } from "./get-featured";
import { getNewArrivals } from "./get-new-arrivals";
import { getNew } from "./get-new";
import { getSale } from "./get-sale";
import { getPopularByCategory } from "./get-popular-by-category";
import { search } from "./search";
import { getAllForCatalog } from "./get-all-for-catalog";
import { getAttributes } from "./get-attributes";
import { getAttributesByCategory } from "./get-attributes-by-category";
import { getCategoryFilters } from "./get-category-filters";
import { getDynamicCategoryFilters } from "./get-dynamic-category-filters";

export const productsRouter = {
  getByCategory,
  getBySlug,
  getCategoryHierarchy,
  getFeatured,
  getNewArrivals,
  getNew,
  getSale,
  getPopularByCategory,
  search,
  getAllForCatalog,
  getAttributes,
  getAttributesByCategory,
  getCategoryFilters,
  getDynamicCategoryFilters,
} satisfies TRPCRouterRecord;
