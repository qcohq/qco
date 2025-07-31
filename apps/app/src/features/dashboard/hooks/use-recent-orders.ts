"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useRecentOrders() {
  const trpc = useTRPC();

  const recentOrdersQueryOptions = trpc.dashboard.getRecentOrders.queryOptions(
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(recentOrdersQueryOptions);
}
