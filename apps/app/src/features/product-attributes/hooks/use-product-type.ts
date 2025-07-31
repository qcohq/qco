"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useProductType(id: string) {
  const trpc = useTRPC();

  const productTypeQueryOptions = trpc.productTypes.getById.queryOptions({
    id,
  });
  const { data, isPending, error } = useQuery(productTypeQueryOptions);

  return {
    productType: data,
    isLoading: isPending,
    error,
  };
}
