import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCategoryHierarchy(categorySlug: string) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const categoryHierarchyQueryOptions =
    trpc.categories.getCategoryHierarchyBySlug.queryOptions({
      categorySlug,
    });

  // Используем опции с хуком useQuery, но только если categorySlug не пустой
  const {
    data: categoryHierarchy,
    isPending,
    error,
  } = useQuery({
    ...categoryHierarchyQueryOptions,
    enabled: !!categorySlug, // Запрос выполняется только если categorySlug не пустой
  });

  return {
    categoryHierarchy,
    isLoading: isPending,
    error,
  };
}
