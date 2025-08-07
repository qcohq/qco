"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { ProductItem } from "@qco/web-validators";

interface UseBrandProductsOptions {
  brandSlug: string;
  limit?: number;
  offset?: number;
  sort?:
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "popular";
}

export function useBrandProducts({
  brandSlug,
  limit = 20,
  offset = 0,
  sort = "newest",
}: UseBrandProductsOptions) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const brandProductsQueryOptions = trpc.brands.getProducts.queryOptions({
    brandSlug,
    limit,
    offset,
    sort,
  });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery(brandProductsQueryOptions);

  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    page: Math.floor(offset / limit) + 1,
    limit: data?.limit || limit,
    totalPages: data?.totalPages || 0,
    isLoading: isPending,
    error,
  };
}
