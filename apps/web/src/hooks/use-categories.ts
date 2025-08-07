"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCategories() {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const categoriesQueryOptions = trpc.categories.getRoot.queryOptions();

  // Используем опции с хуком useQuery
  const {
    data: categories,
    isPending: isLoading,
    error,
  } = useQuery(categoriesQueryOptions);

  return {
    categories,
    isLoading,
    error,
  };
}
