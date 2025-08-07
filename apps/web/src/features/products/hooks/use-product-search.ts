"use client";

import type { ProductItem } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

interface UseProductSearchOptions {
  query: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?:
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";
  limit?: number;
  offset?: number;
  inStock?: boolean;
  onSale?: boolean;
}

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number | null;
  salePrice: number | null;
  discountPercent: number | null;
  stock: number | null;
  sku: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  category: string | null;
  brand: string | null;
}

export function useProductSearch({
  query,
  categoryId,
  brandId,
  minPrice,
  maxPrice,
  sort = "relevance",
  limit = 20,
  offset = 0,
  inStock,
  onSale,
}: UseProductSearchOptions) {
  const trpc = useTRPC();

  // Создаем опции запроса для поиска продуктов
  const searchQueryOptions = trpc.products.search.queryOptions({
    query,
    categoryId,
    brandId,
    minPrice,
    maxPrice,
    sort,
    limit,
    offset,
    inStock,
    onSale,
  });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery({
    ...searchQueryOptions,
    enabled: !!query.trim(), // Запрос выполняется только если есть поисковый запрос
  });

  // Преобразуем данные в формат ProductItem
  const products: ProductItem[] = (data?.products || []).map(
    (product: SearchProduct) => ({
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
      inStock: product.stock ? product.stock > 0 : false,
      category: product.category || "",
      isNew: product.isNew || false,
      rating: 0, // Рейтинг не предоставляется в текущей схеме
    }),
  );

  return {
    products,
    totalCount: data?.totalCount || 0,
    isLoading: isPending,
    error,
  };
}
