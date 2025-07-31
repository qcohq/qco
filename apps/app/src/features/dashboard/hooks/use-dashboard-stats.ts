"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useDashboardStats() {
  const trpc = useTRPC();

  const statsQueryOptions = trpc.dashboard.stats.queryOptions(undefined, {
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  return useQuery(statsQueryOptions);
}
