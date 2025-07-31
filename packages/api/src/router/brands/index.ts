import type { TRPCRouterRecord } from "@trpc/server";

import { bulkDeleteBrands } from "./bulk-delete";
import { create } from "./create";
import { deleteBrand } from "./delete";
import { generateSlugRoute } from "./generate-slug";
import { getAll } from "./get-all";
import { getBrandsForSelect } from "./get-brands-for-select";
import { getById } from "./get-by-id";
import { getBySlug } from "./get-by-slug";
import { getBrandFilters } from "./get-brand-filters";
import { updateBrand } from "./update";

export const brandsRouter = {
  bulkDelete: bulkDeleteBrands,
  create,
  delete: deleteBrand,
  generateSlug: generateSlugRoute,
  getAll,
  getBrandsForSelect,
  getById,
  getBySlug,
  getBrandFilters,
  update: updateBrand,
} satisfies TRPCRouterRecord;
