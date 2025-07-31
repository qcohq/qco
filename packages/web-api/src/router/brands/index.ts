import type { TRPCRouterRecord } from "@trpc/server";
import { getAllBrands } from "./get-all";
import { getFeaturedBrands } from "./get-featured";
import { getById } from "./get-by-id";
import { getBySlug } from "./get-by-slug";
import { getProducts } from "./get-products";
import { getBrandsByCategory } from "./get-by-category";
import { getWithProducts } from "./get-with-products";
import { getBrandsAlphabetical } from "./get-alphabetical";
import { getBrandFilters } from "./get-brand-filters";

export const brandsRouter = {
  getAll: getAllBrands,
  getFeatured: getFeaturedBrands,
  getById,
  getBySlug,
  getProducts,
  getByCategory: getBrandsByCategory,
  getWithProducts,
  getAlphabetical: getBrandsAlphabetical,
  getBrandFilters,
} satisfies TRPCRouterRecord; 
