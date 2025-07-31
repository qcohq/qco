"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useTopProducts() {
  const trpc = useTRPC();

  const topProductsQueryOptions = trpc.dashboard.getTopProducts.queryOptions(
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(topProductsQueryOptions);
}
