import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

/**
 * Хук для получения корневых категорий (первого уровня)
 * с количеством товаров в каждой категории
 */
export function useRootCategories() {
    const trpc = useTRPC();

    const queryOptions = trpc.categories.getAll.queryOptions();

    return useQuery(queryOptions);
} 