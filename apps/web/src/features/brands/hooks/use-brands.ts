"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { BrandListItem } from "@qco/web-validators";

interface UseBrandsOptions {
  limit?: number;
  page?: number;
  sortBy?: "name" | "createdAt" | "isFeatured";
  sortOrder?: "asc" | "desc";
  search?: string;
  featured?: boolean;
}

export function useBrands(options: UseBrandsOptions = {}) {
  const {
    limit = 50,
    page = 1,
    sortBy = "name",
    sortOrder = "asc",
    search,
    featured,
  } = options;

  const trpc = useTRPC();

  const queryOptions = trpc.brands.getAll.queryOptions({
    limit,
    page,
    sortBy,
    sortOrder,
    search,
    featured,
  });

  const { data, isPending, error } = useQuery(queryOptions);

  return {
    brands: (data?.brands || []) as BrandListItem[],
    pagination: data?.pagination,
    totalCount: data?.pagination?.total || 0,
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: data?.pagination?.page || 1,
    isLoading: isPending,
    error,
  };
}
