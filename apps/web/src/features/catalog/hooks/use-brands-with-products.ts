import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useBrandsWithProducts() {
  const trpc = useTRPC();

  const queryOptions = trpc.brands.getWithProducts.queryOptions();

  return useQuery(queryOptions);
}
