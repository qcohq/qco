"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { FeaturedBrand } from "@qco/web-validators";

interface UseFeaturedBrandsOptions {
  limit?: number;
}

export function useFeaturedBrands(options: UseFeaturedBrandsOptions = {}) {
  const { limit = 6 } = options;

  const trpc = useTRPC();

  const featuredBrandsQueryOptions = trpc.brands.getFeatured.queryOptions({
    limit,
  });

  const { data, isPending, error } = useQuery(featuredBrandsQueryOptions);

  return {
    brands: (data || []) as FeaturedBrand[],
    isLoading: isPending,
    error,
  };
}
