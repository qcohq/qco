import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

interface UseOrdersListOptions {
    limit?: number;
    offset?: number;
    status?: string;
    customerId?: string;
    orderNumber?: string;
}

export function useOrdersList(options: UseOrdersListOptions = {}) {
    const trpc = useTRPC();
    const { limit = 20, offset = 0, status, customerId, orderNumber } = options;

    // Создаем опции запроса с помощью queryOptions
    const ordersQueryOptions = trpc.orders.getOrders.queryOptions({
        limit,
        offset,
        status,
        customerId,
        orderNumber,
    });

    // Используем опции с хуком useQuery
    const { data, isPending, error, refetch } = useQuery(ordersQueryOptions);

    return {
        orders: data?.orders || [],
        pagination: data?.pagination || {
            total: 0,
            limit,
            offset,
            hasMore: false,
            totalPages: 0,
            currentPage: 1,
        },
        isLoading: isPending,
        error,
        refetch,
    };
} 