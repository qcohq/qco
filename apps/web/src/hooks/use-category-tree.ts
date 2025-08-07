"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCategoryTree() {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const categoryTreeQueryOptions = trpc.categories.getTree.queryOptions();

  // Используем опции с хуком useQuery
  const {
    data: categoryTree,
    isPending: isLoading,
    error,
  } = useQuery(categoryTreeQueryOptions);

  return {
    categoryTree,
    isLoading,
    error,
  };
}
