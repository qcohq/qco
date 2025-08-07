import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCategoryChildren(parentCategorySlug: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.categories.getChildrenByParent.queryOptions({
    parentCategorySlug,
  });

  return useQuery(queryOptions);
}
