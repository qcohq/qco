import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useOptimizedQueries() {
  const trpc = useTRPC();

  const categoriesQuery = useQuery({
    ...trpc.categories.tree.queryOptions(),
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 15 * 60 * 1000, // 15 минут
    refetchOnWindowFocus: false,
  });

  const brandsQuery = useQuery({
    ...trpc.brands.getAll.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
    refetchOnWindowFocus: false,
  });

  return {
    categories: categoriesQuery,
    brands: brandsQuery,
  };
}
