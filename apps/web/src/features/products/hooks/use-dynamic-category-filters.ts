"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { GetCategoryFiltersResponse } from "@qco/web-validators";
import type { CatalogFilters } from "../types/catalog";

interface UseDynamicCategoryFiltersParams {
    categorySlug: string;
    appliedFilters: CatalogFilters;
}

export function useDynamicCategoryFilters({ categorySlug, appliedFilters }: UseDynamicCategoryFiltersParams) {
    const trpc = useTRPC();

    // Преобразуем фильтры в формат API
    const apiFilters = {
        brands: appliedFilters.brands.length > 0 ? appliedFilters.brands : undefined,
        priceRange: (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 1000000)
            ? appliedFilters.priceRange as [number, number]
            : undefined,
        sizes: appliedFilters.sizes && appliedFilters.sizes.length > 0 ? appliedFilters.sizes : undefined,
        colors: appliedFilters.colors && appliedFilters.colors.length > 0 ? appliedFilters.colors : undefined,
        inStock: appliedFilters.inStock || undefined,
        onSale: appliedFilters.onSale || undefined,
        attributes: Object.keys(appliedFilters.attributes || {}).length > 0 ? appliedFilters.attributes : undefined,
    };

    // Создаем опции запроса с помощью queryOptions
    const dynamicFiltersQueryOptions = trpc.products.getDynamicCategoryFilters.queryOptions({
        categorySlug,
        appliedFilters: apiFilters,
    });

    // Используем опции с хуком useQuery с сохранением предыдущих данных
    const { data, isPending, isFetching, error } = useQuery({
        ...dynamicFiltersQueryOptions,
        // сохраняем предыдущие данные, чтобы не показывать скелетон при применении фильтров
        placeholderData: (prev) => prev,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });

    // Предоставляем типизированные данные
    const filters: GetCategoryFiltersResponse = data || {
        sizes: [],
        colors: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
        totalProducts: 0,
        attributes: {},
    };

    return {
        filters,
        // initial loading — только первый запрос без предыдущих данных
        isInitialLoading: isPending && !data,
        // refetching при применении фильтров (данные при этом остаются)
        isRefetching: isFetching && !!data,
        error,
        // Полезные вычисляемые свойства
        hasSizes: filters.sizes.length > 0,
        hasColors: filters.colors.length > 0,
        hasBrands: filters.brands.length > 0,
        hasPriceRange: filters.priceRange.max > filters.priceRange.min,
        hasAttributes: Object.keys(filters.attributes || {}).length > 0,
        hasFilters: filters.sizes.length > 0 ||
            filters.colors.length > 0 ||
            filters.brands.length > 0 ||
            Object.keys(filters.attributes || {}).length > 0,
    };
} 