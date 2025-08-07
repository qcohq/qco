import { getBannersByPositionSchema } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { CatalogDataState } from "../types";

export function useCatalogData(): CatalogDataState {
  const trpc = useTRPC();

  // Получаем избранные бренды
  const brandsQueryOptions = trpc.brands.getFeatured.queryOptions({ limit: 6 });
  const { data: brands, isLoading: brandsLoading } =
    useQuery(brandsQueryOptions);

  // Получаем баннеры для каталога
  const bannersQueryOptions = trpc.banners.getByPosition.queryOptions(
    getBannersByPositionSchema.parse({
      position: "catalog",
      limit: 3,
    }),
  );
  const { data: banners, isLoading: bannersLoading } =
    useQuery(bannersQueryOptions);

  const isLoading = brandsLoading || bannersLoading;

  return {
    categories: null, // Категории теперь обрабатываются отдельно через useRootCategories
    brands: brands || null,
    banners: banners || null,
    isLoading,
  };
}
