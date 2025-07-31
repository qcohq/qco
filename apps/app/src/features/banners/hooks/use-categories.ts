import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useCategories() {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.categories.tree.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
