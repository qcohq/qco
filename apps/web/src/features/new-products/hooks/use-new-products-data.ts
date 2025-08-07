import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { CategoryType, NewProductsDataState } from "../types";

export function useNewProductsData(
  category: CategoryType,
): NewProductsDataState {
  const trpc = useTRPC();

  // Получаем новинки для конкретной категории
  const productsQueryOptions = trpc.products.getNew.queryOptions({
    category,
    limit: 12,
  });

  const { data: products, isLoading } = useQuery(productsQueryOptions);

  return {
    products: products || null,
    isLoading,
  };
}
