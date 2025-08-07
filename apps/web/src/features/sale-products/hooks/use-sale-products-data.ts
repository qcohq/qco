import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { CategoryType, SaleProductsDataState } from "../types";

export function useSaleProductsData(
    category: CategoryType,
): SaleProductsDataState {
    const trpc = useTRPC();

    // Получаем товары со скидкой для конкретной категории
    const productsQueryOptions = trpc.products.getSale.queryOptions({
        category,
        limit: 12,
    });

    const { data: products, isLoading } = useQuery(productsQueryOptions);

    return {
        products: products || null,
        isLoading,
    };
} 