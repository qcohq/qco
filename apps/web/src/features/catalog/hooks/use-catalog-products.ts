import { getAllForCatalogInputSchema } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useCatalogProducts(input: {
  limit?: number;
  offset?: number;
  sort?:
    | "newest"
    | "price-asc"
    | "price-desc"
    | "name-asc"
    | "name-desc"
    | "popular";
}) {
  const trpc = useTRPC();

  const queryOptions = trpc.products.getAllForCatalog.queryOptions(
    getAllForCatalogInputSchema.parse(input),
  );

  return useQuery(queryOptions);
}
