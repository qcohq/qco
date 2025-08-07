import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useSession } from "./use-session";

export function useProfileStats() {
  const trpc = useTRPC();
  const { isAuthenticated } = useSession();

  const profileStatsQueryOptions = trpc.profile.getProfileStats.queryOptions(
    undefined,
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
      enabled: isAuthenticated, // Запрос выполняется только если пользователь авторизован
    },
  );

  return useQuery(profileStatsQueryOptions);
}
