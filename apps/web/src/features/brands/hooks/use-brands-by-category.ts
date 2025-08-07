"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { FeaturedBrand } from "@qco/web-validators";

interface UseBrandsByCategoryOptions {
  categorySlug: string;
  limit?: number;
}

export function useBrandsByCategory(options: UseBrandsByCategoryOptions) {
  const { categorySlug, limit = 6 } = options;

  const trpc = useTRPC();

  const brandsByCategoryQueryOptions = trpc.brands.getByCategory.queryOptions({
    categorySlug,
    limit,
  });

  const { data, isPending, error } = useQuery(brandsByCategoryQueryOptions);

  return {
    brands: (data || []) as FeaturedBrand[],
    isLoading: isPending,
    error,
  };
}
