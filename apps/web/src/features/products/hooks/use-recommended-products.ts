"use client";

import type { ProductItem } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

interface UseRecommendedProductsOptions {
  currentProductId: string;
  limit?: number;
  categorySlug?: string;
}

export function useRecommendedProducts({
  currentProductId,
  limit = 4,
  categorySlug,
}: UseRecommendedProductsOptions) {
  const trpc = useTRPC();

  // Создаем опции запроса для получения рекомендуемых продуктов
  const recommendedProductsQueryOptions =
    trpc.products.getByCategory.queryOptions({
      categorySlug: categorySlug || "all",
      limit: limit + 1, // Получаем на один больше, чтобы исключить текущий продукт
      offset: 0,
      sort: "popular",
    });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery(recommendedProductsQueryOptions);

  // Фильтруем и преобразуем данные в формат ProductItem
  const recommendedProducts: ProductItem[] = (data?.products || [])
    .filter((product: any) => product.id !== currentProductId)
    .slice(0, limit)
    .map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      basePrice: product.basePrice || 0,
      salePrice: product.salePrice,
      onSale: Boolean(product.salePrice && product.salePrice < (product.basePrice || 0)),
      image: product.image,
      images: product.images || [],
      brand: product.brand || "",
      inStock: product.stock > 0,
      category: product.category || "",
      isNew: product.isNew || false,
      rating: product.rating || 0,
    }));

  return {
    recommendedProducts,
    isLoading: isPending,
    error,
  };
}
