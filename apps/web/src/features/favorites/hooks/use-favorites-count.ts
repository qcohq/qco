"use client";

import { authClient } from "@qco/web-auth/client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useGuestId } from "./use-guest-id";

/**
 * Хук для получения только количества избранных товаров
 * Оптимизирован для использования в навигации и других компонентах,
 * где не нужны полные данные избранного
 */
export function useFavoritesCount() {
  const { data: session } = authClient.useSession();
  const { guestId, isLoading: isGuestIdLoading } = useGuestId();
  const trpc = useTRPC();

  const isAuthenticated = !!session;

  // Создаем опции запроса с помощью queryOptions
  const favoritesQueryOptions = trpc.favorites.getFavorites.queryOptions(
    { guestId: !isAuthenticated ? guestId : undefined },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      enabled: isAuthenticated || (!isGuestIdLoading && !!guestId), // Запрос выполняется только если пользователь авторизован или есть guestId
      select: (data) => {
        // Выбираем только количество избранных товаров для оптимизации
        return data?.length || 0;
      },
    },
  );

  // Используем опции с хуком useQuery
  const {
    data: favoritesCount,
    isPending,
    error,
  } = useQuery(favoritesQueryOptions);

  return {
    favoritesCount: favoritesCount || 0,
    isLoading: isPending || isGuestIdLoading,
    error,
  };
}
