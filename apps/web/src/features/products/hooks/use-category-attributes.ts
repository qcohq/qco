"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { CategoryAttribute } from "@qco/web-validators";

export function useCategoryAttributes(categorySlug?: string) {
    const trpc = useTRPC();

    const queryOptions = trpc.products.getAttributesByCategory.queryOptions({
        categorySlug: categorySlug || "all",
    });

    const { data, isPending, error } = useQuery({
        ...queryOptions,
        enabled: !!categorySlug && categorySlug !== "all",
    });

    return {
        attributes: (data as CategoryAttribute[]) || [],
        isLoading: isPending,
        error,
    };
} 