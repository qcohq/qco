"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useStats() {
  const trpc = useTRPC();

  const statsQueryOptions = trpc.dashboard.stats.queryOptions(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return useQuery(statsQueryOptions);
}
