"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { GetCategoryFiltersResponse } from "@qco/web-validators";

export function useCategoryFilters(categorySlug: string) {
    const trpc = useTRPC();

    // Создаем опции запроса с помощью queryOptions
    const categoryFiltersQueryOptions = trpc.products.getCategoryFilters.queryOptions({
        categorySlug,
    });

    // Используем опции с хуком useQuery
    const { data, isPending, error } = useQuery(categoryFiltersQueryOptions);

    // Предоставляем типизированные данные
    const filters: GetCategoryFiltersResponse = data || {
        sizes: [],
        colors: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
        totalProducts: 0,
    };

    return {
        filters,
        isPending,
        error,
        // Полезные вычисляемые свойства
        hasSizes: filters.sizes.length > 0,
        hasColors: filters.colors.length > 0,
        hasBrands: filters.brands.length > 0,
        hasPriceRange: filters.priceRange.max > filters.priceRange.min,
        hasFilters: filters.sizes.length > 0 || filters.colors.length > 0 || filters.brands.length > 0 || (filters.attributes && Object.keys(filters.attributes).length > 0),
    };
} 