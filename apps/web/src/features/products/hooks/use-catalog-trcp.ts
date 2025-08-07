"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import type { CatalogFilters } from "../types/catalog";

// Начальные фильтры с динамическими ценами
const createInitialFilters = (priceRange?: { min: number; max: number }): CatalogFilters => ({
  brands: [],
  priceRange: priceRange ? [priceRange.min, priceRange.max] : [0, 500000],
  sizes: [],
  colors: [],
  categories: [],
  inStock: false,
  onSale: false,
  attributes: {},
});

export function useCatalogTRPC(
  category?: string,
  subcategory?: string,
  searchQuery?: string,
) {
  const trpc = useTRPC();
  const [filters, setFilters] = useState<CatalogFilters>(createInitialFilters());
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular">("newest");

  // Получаем доступные фильтры для категории
  const categoryFiltersQueryOptions = trpc.products.getCategoryFilters.queryOptions({
    categorySlug: category || "all",
  });

  const { data: categoryFiltersData } = useQuery(categoryFiltersQueryOptions);

  // Обновляем фильтры при получении данных о ценах
  useEffect(() => {
    if (categoryFiltersData?.priceRange) {
      const { min, max } = categoryFiltersData.priceRange;
      if (min > 0 || max > 0) {
        setFilters(prev => ({
          ...prev,
          priceRange: [min, max]
        }));
      }
    }
  }, [categoryFiltersData]);

  // Создаем опции запроса для получения продуктов по категории с фильтрами
  const productsQueryOptions = trpc.products.getByCategory.queryOptions({
    categorySlug: category || "all",
    limit: 100, // Увеличиваем лимит для получения всех продуктов
    offset: 0,
    sort: sortBy,
    filters: {
      brands: filters.brands.length > 0 ? filters.brands : undefined,
      priceRange: (filters.priceRange[0] > 0 || filters.priceRange[1] < (categoryFiltersData?.priceRange?.max || 500000)) ? filters.priceRange : undefined,
      sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
      colors: filters.colors.length > 0 ? filters.colors : undefined,
      inStock: filters.inStock || undefined,
      onSale: filters.onSale || undefined,
      attributes: Object.keys(filters.attributes).length > 0 ? filters.attributes : undefined,
    },
  });

  // Используем useQuery для получения данных
  const { data, isPending, error } = useQuery(productsQueryOptions);

  const products = data?.products || [];

  // Просто фильтруем по подкатегории, если нужно
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Фильтр по подкатегории (если нужен дополнительный фильтр)
    if (subcategory) {
      filtered = filtered.filter((product) =>
        product.description?.toLowerCase().includes(subcategory.toLowerCase()),
      );
    }

    return filtered;
  }, [products, subcategory]);

  const updateFilter = (filterType: keyof CatalogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    // Используем динамические цены при сбросе фильтров
    const maxPrice = categoryFiltersData?.priceRange?.max || 500000;
    const minPrice = categoryFiltersData?.priceRange?.min || 0;
    setFilters(createInitialFilters({ min: minPrice, max: maxPrice }));
  };

  const removeFilter = (
    filterType: keyof CatalogFilters,
    value: string | boolean,
  ) => {
    if (filterType === "priceRange") {
      // Сбрасываем к динамическим ценам из API
      const maxPrice = categoryFiltersData?.priceRange?.max || 500000;
      const minPrice = categoryFiltersData?.priceRange?.min || 0;
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }));
    } else if (filterType === "inStock" || filterType === "onSale") {
      setFilters((prev) => ({
        ...prev,
        [filterType]: false,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: (prev[filterType] as string[]).filter(
          (item) => item !== value,
        ),
      }));
    }
  };

  return {
    filters,
    sortBy,
    setSortBy,
    filteredProducts,
    updateFilter,
    clearFilters,
    removeFilter,
    isPending,
    error,
    // Добавляем доступные фильтры для использования в компонентах
    availableFilters: categoryFiltersData,
  };
}
