import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useTeams() {
  const trpc = useTRPC();

  const teamsQueryOptions = trpc.auth.getTeams.queryOptions(undefined, {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const {
    data: teams,
    isPending: teamsLoading,
    error: teamsError,
  } = useQuery(teamsQueryOptions);

  return {
    teams,
    teamsLoading,
    teamsError,
  };
}
