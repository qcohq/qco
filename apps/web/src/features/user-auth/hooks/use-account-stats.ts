import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useSession } from "./use-session";

export function useAccountStats() {
  const trpc = useTRPC();
  const { session, isAuthenticated } = useSession();

  // Получение статистики аккаунта с оптимизированными настройками кэширования
  const statsQueryOptions = trpc.account.getStats.queryOptions(undefined, {
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
    refetchOnWindowFocus: false,
    enabled: isAuthenticated, // Запрос выполняется только если пользователь авторизован
  });

  const {
    data: stats,
    isPending: statsLoading,
    error: statsError,
  } = useQuery(statsQueryOptions);

  return {
    stats,
    statsLoading,
    statsError,
    isAuthenticated,
  };
}

// Безопасная версия хука для использования вне TRPCProvider
export function useAccountStatsSafe() {
  try {
    return useAccountStats();
  } catch (error) {
    // Возвращаем fallback значения если tRPC недоступен
    return {
      stats: null,
      statsLoading: false,
      statsError: null,
      isAuthenticated: false,
    };
  }
}
