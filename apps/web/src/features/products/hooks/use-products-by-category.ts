import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { ProductListItem } from "../types/product-list";

interface UseProductsByCategoryParams {
  categorySlug: string;
  limit?: number;
  offset?: number;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
}

interface UseProductsByCategoryResult {
  products: ProductListItem[];
  total: number;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

export function useProductsByCategory({
  categorySlug,
  limit = 20,
  offset = 0,
  sort = "newest",
}: UseProductsByCategoryParams): UseProductsByCategoryResult {
  const trpc = useTRPC();

  const queryOptions = trpc.products.getByCategory.queryOptions({
    categorySlug,
    limit,
    offset,
    sort,
  });

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    products: (data?.products as ProductListItem[]) || [],
    total: data?.totalCount || 0,
    isLoading: isPending,
    error,
    refetch,
  };
}
