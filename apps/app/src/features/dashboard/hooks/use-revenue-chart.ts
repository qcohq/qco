"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useRevenueChart() {
  const trpc = useTRPC();

  const revenueChartQueryOptions = trpc.dashboard.revenueChart.queryOptions(
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(revenueChartQueryOptions);
}
