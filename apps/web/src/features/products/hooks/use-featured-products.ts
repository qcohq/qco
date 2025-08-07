import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { ProductListItem } from "../types/product-list";

interface UseFeaturedProductsParams {
  limit?: number;
}

interface UseFeaturedProductsResult {
  products: ProductListItem[];
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

export function useFeaturedProducts({
  limit = 10,
}: UseFeaturedProductsParams = {}): UseFeaturedProductsResult {
  const trpc = useTRPC();

  const queryOptions = trpc.products.getFeatured.queryOptions({
    limit,
  });

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    products: (data as ProductListItem[]) || [],
    isLoading: isPending,
    error,
    refetch,
  };
}
