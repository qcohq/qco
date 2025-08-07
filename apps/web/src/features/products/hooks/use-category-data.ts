"use client";

import type { RouterOutputs } from "@qco/web-api";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

type CategoryData = RouterOutputs["categories"]["getBySlug"];

export function useCategoryData(categorySlug?: string) {
  const trpc = useTRPC();

  const categoryQueryOptions = trpc.categories.getBySlug.queryOptions({
    slug: categorySlug || "",
  });

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery({
    ...categoryQueryOptions,
    enabled: !!categorySlug,
  });

  return {
    categoryData,
    isLoading,
    error,
  };
}
