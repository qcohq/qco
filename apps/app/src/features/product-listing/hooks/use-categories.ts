import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

/**
 * Хук для получения списка категорий из API через tRPC
 */
export function useCategories() {
  const trpc = useTRPC();

  const queryOptions = trpc.categories.tree.queryOptions();
  return useQuery(queryOptions);
}
