import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

type OrdersStats = {
  byStatus?: {
    pending?: {
      count: number;
      last24h: number;
    };
  };
  totalLast24h?: number;
};

export function useOrdersStats() {
  const trpc = useTRPC();
  const ordersStatsQueryOptions = trpc.orders.stats.queryOptions();

  const {
    data: stats = {} as OrdersStats,
    isLoading,
    error,
  } = useQuery(ordersStatsQueryOptions);

  // New orders - orders with status "pending" (awaiting processing)
  const newOrdersCount = stats?.byStatus?.pending?.count || 0;

  // Orders in the last 24 hours
  const ordersLast24h = stats?.totalLast24h || 0;

  // New orders in the last 24 hours
  const newOrdersLast24h = stats?.byStatus?.pending?.last24h || 0;

  return {
    stats,
    newOrdersCount,
    ordersLast24h,
    newOrdersLast24h,
    isLoading,
    error,
  };
}
