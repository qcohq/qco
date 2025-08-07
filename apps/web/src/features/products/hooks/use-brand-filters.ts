"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { GetBrandFiltersResponse } from "@qco/web-validators";

export function useBrandFilters(brandSlug: string) {
    const trpc = useTRPC();

    // Создаем опции запроса с помощью queryOptions
    const brandFiltersQueryOptions = trpc.brands.getBrandFilters.queryOptions({
        brandSlug,
    });

    // Используем опции с хуком useQuery
    const { data, isPending, error } = useQuery(brandFiltersQueryOptions);

    // Предоставляем типизированные данные
    const filters: GetBrandFiltersResponse = data || {
        sizes: [],
        colors: [],
        priceRange: { min: 0, max: 0 },
        totalProducts: 0,
        attributes: {},
    };

    return {
        filters,
        isPending,
        error,
        // Полезные вычисляемые свойства
        hasSizes: filters.sizes.length > 0,
        hasColors: filters.colors.length > 0,
        hasPriceRange: filters.priceRange.max > filters.priceRange.min,
        hasAttributes: filters.attributes && Object.keys(filters.attributes).length > 0,
        hasFilters: filters.sizes.length > 0 || filters.colors.length > 0 || (filters.attributes && Object.keys(filters.attributes).length > 0),
    };
} 