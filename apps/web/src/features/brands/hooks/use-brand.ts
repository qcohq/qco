"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { BrandDetail } from "@qco/web-validators";

export function useBrand(slug: string) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const brandQueryOptions = trpc.brands.getBySlug.queryOptions({ slug });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery(brandQueryOptions);

  return {
    brand: data as BrandDetail | undefined,
    isLoading: isPending,
    error,
  };
}
