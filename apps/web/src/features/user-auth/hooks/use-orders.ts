import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export type OrderStatus = "all" | "processing" | "shipped" | "delivered" | "cancelled";

interface UseOrdersOptions {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const trpc = useTRPC();
  const { status = "all", limit = 20, offset = 0 } = options;

  // Создаем опции запроса с помощью queryOptions
  const ordersHistoryQueryOptions = trpc.profile.getOrdersHistory.queryOptions({
    status,
    limit,
    offset,
  });

  // Используем опции с хуком useQuery
  return useQuery(ordersHistoryQueryOptions);
}

export function useOrderById(orderId: string) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const orderByIdQueryOptions = trpc.profile.getOrderById.queryOptions({
    orderId
  });

  // Используем опции с хуком useQuery
  return useQuery({
    ...orderByIdQueryOptions,
    enabled: !!orderId,
  });
}
