import type { ProductListInput, ProductTableSortConfig } from "@qco/validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import type { FilterState } from "../types";

/**
 * Хук для получения списка продуктов из API через tRPC
 */
export function useProductsList(
  filters: FilterState,
  page: number,
  pageSize: number,
  sortConfig?: ProductTableSortConfig,
) {
  const trpc = useTRPC();

  const queryParams: Omit<ProductListInput, "page" | "limit"> = {
    search: filters.search || undefined,
    status: filters.status === "all" ? undefined : filters.status,
    categories:
      filters.categories && filters.categories.length > 0
        ? filters.categories
        : undefined,
    minPrice: filters.minPrice ?? 0,
    maxPrice: filters.maxPrice ?? 100000,
    sortBy: sortConfig?.sortBy,
    sortOrder: sortConfig?.sortOrder,
  };
  const queryOptions = trpc.products.list.queryOptions({
    page,
    limit: pageSize,
    ...queryParams,
  });
  return useQuery(queryOptions);
}
