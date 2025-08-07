"use client";
import type {
  GetBrandsAlphabeticalInput,
  GetBrandsAlphabeticalResponse,
} from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useBrandsAlphabetical(options: GetBrandsAlphabeticalInput) {
  const { categorySlug, limit = 1000 } = options;

  const trpc = useTRPC();

  const queryOptions = trpc.brands.getAlphabetical.queryOptions({
    categorySlug,
    limit,
  });

  const { data, isPending, error } = useQuery(queryOptions);

  return {
    groupedBrands: (data?.groupedBrands ||
      {}) as GetBrandsAlphabeticalResponse["groupedBrands"],
    availableLetters: (data?.availableLetters ||
      []) as GetBrandsAlphabeticalResponse["availableLetters"],
    totalBrands: data?.totalBrands || 0,
    isLoading: isPending,
    error,
  };
}
