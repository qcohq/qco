import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useProductCategoryHierarchy(productSlug?: string) {
  const trpc = useTRPC();

  // Используем useQuery только если productSlug определен
  const {
    data: categoryHierarchy,
    isPending,
    error,
  } = useQuery({
    ...trpc.products.getCategoryHierarchy.queryOptions({ productSlug: productSlug || "" }),
    enabled: !!productSlug, // Запрос выполняется только если productSlug не пустой
  });

  return {
    categoryHierarchy: productSlug ? categoryHierarchy : undefined,
    isLoading: productSlug ? isPending : false,
    error: productSlug ? error : undefined,
  };
}
