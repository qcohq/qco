import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCategoriesWithChildren() {
  const trpc = useTRPC();

  const queryOptions = trpc.categories.getTree.queryOptions();

  return useQuery(queryOptions);
}
