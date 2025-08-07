"use client";

import type { AppRouter } from "@qco/web-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "@/features/user-auth/hooks/use-session";
import { useTRPC } from "@/trpc/react";
import { useGuestId } from "./use-guest-id";

export function useFavorites() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { session, isAuthenticated } = useSession();
  const { guestId, isLoading: isGuestIdLoading, clearGuestId } = useGuestId();

  // Создаем опции запроса с помощью queryOptions
  const favoritesQueryOptions = trpc.favorites.getFavorites.queryOptions(
    { guestId: !isAuthenticated ? guestId : undefined },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      refetchOnWindowFocus: false,
      enabled: isAuthenticated || (!isGuestIdLoading && !!guestId), // Запрос выполняется только если пользователь авторизован или есть guestId
    },
  );

  // Используем опции с хуком useQuery
  const { data: favorites, isPending, error } = useQuery(favoritesQueryOptions);

  // Создаем опции мутации для добавления в избранное
  const addToFavoritesMutationOptions =
    trpc.favorites.addToFavorites.mutationOptions({
      onSuccess: (data) => {
        // Инвалидируем кэш избранного
        queryClient.invalidateQueries({
          queryKey: trpc.favorites.getFavorites.queryKey(),
        });

        // Инвалидируем кэш статистики аккаунта (если пользователь авторизован)
        if (isAuthenticated) {
          queryClient.invalidateQueries({
            queryKey: trpc.account.getStats.queryKey(),
          });
        }

        toast.success("Товар добавлен в избранное", {
          description: data.message,
        });
      },
      onError: (error: TRPCClientErrorLike<AppRouter>) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось добавить в избранное",
        });
      },
    });

  // Создаем опции мутации для удаления из избранного
  const removeFromFavoritesMutationOptions =
    trpc.favorites.removeFromFavorites.mutationOptions({
      onSuccess: (data) => {
        // Инвалидируем кэш избранного
        queryClient.invalidateQueries({
          queryKey: trpc.favorites.getFavorites.queryKey(),
        });

        // Инвалидируем кэш статистики аккаунта (если пользователь авторизован)
        if (isAuthenticated) {
          queryClient.invalidateQueries({
            queryKey: trpc.account.getStats.queryKey(),
          });
        }

        toast.success("Товар удален из избранного", {
          description: data.message,
        });
      },
      onError: (error: TRPCClientErrorLike<AppRouter>) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось удалить из избранного",
        });
      },
    });

  // Создаем опции мутации для синхронизации гостевых избранных товаров
  const syncGuestFavoritesMutationOptions =
    trpc.favorites.syncGuestFavorites.mutationOptions({
      onSuccess: (data) => {
        // Инвалидируем кэш избранного
        queryClient.invalidateQueries({
          queryKey: trpc.favorites.getFavorites.queryKey(),
        });

        // Инвалидируем кэш статистики аккаунта
        queryClient.invalidateQueries({
          queryKey: trpc.account.getStats.queryKey(),
        });

        // Очищаем guestId после успешной синхронизации
        clearGuestId();

        toast.success("Избранное синхронизировано", {
          description: data.message,
        });
      },
      onError: (error: TRPCClientErrorLike<AppRouter>) => {
        toast.error("Ошибка синхронизации", {
          description: error.message || "Не удалось синхронизировать избранное",
        });
      },
    });

  // Используем опции с хуком useMutation
  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    useMutation(addToFavoritesMutationOptions);
  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorites } =
    useMutation(removeFromFavoritesMutationOptions);
  const { mutate: syncGuestFavorites, isPending: isSyncing } =
    useMutation(syncGuestFavoritesMutationOptions);

  // Проверка, находится ли товар в избранном
  const isFavorite = useCallback(
    (productId: string) => {
      return (
        favorites?.some((favorite: any) => favorite.productId === productId) ||
        false
      );
    },
    [favorites],
  );

  // Переключение состояния избранного
  const toggleFavorite = useCallback(
    (productId: string) => {
      if (isFavorite(productId)) {
        removeFromFavorites({
          productId,
          guestId: !isAuthenticated ? guestId : undefined
        });
      } else {
        addToFavorites({
          productId,
          guestId: !isAuthenticated ? guestId : undefined
        });
      }
    },
    [
      isFavorite,
      addToFavorites,
      removeFromFavorites,
      isAuthenticated,
      guestId,
    ],
  );

  // Очистка всего избранного
  const clearFavorites = useCallback(() => {
    if (favorites && favorites.length > 0) {
      // Удаляем все товары из избранного
      favorites.forEach((favorite: any) => {
        removeFromFavorites({
          productId: favorite.productId,
          guestId: !isAuthenticated ? guestId : undefined
        });
      });
    }
  }, [favorites, removeFromFavorites, isAuthenticated, guestId]);

  // Синхронизация гостевых избранных товаров при авторизации
  useEffect(() => {
    if (isAuthenticated && guestId && favorites && favorites.length > 0) {
      // Проверяем, есть ли гостевые избранные товары
      const hasGuestFavorites = favorites.some((favorite: any) => favorite.guestId);

      if (hasGuestFavorites) {
        syncGuestFavorites({ guestId });
      }
    }
  }, [isAuthenticated, guestId, favorites, syncGuestFavorites]);

  return {
    favorites: favorites || [],
    favoritesCount: favorites?.length || 0,
    isLoading: isPending || isGuestIdLoading,
    isFavorite,
    toggleFavorite,
    addToFavorites: (productId: string) => {
      addToFavorites({
        productId,
        guestId: !isAuthenticated ? guestId : undefined
      });
    },
    removeFromFavorites: (productId: string) => {
      removeFromFavorites({
        productId,
        guestId: !isAuthenticated ? guestId : undefined
      });
    },
    clearFavorites,
    syncGuestFavorites: () => {
      if (guestId) {
        syncGuestFavorites({ guestId });
      }
    },
    isAddingToFavorites,
    isRemovingFromFavorites,
    isSyncing,
    error,
    isLocal: !isAuthenticated,
    guestId,
  };
}

// Безопасная версия хука для использования вне TRPCProvider
export function useFavoritesSafe() {
  try {
    return useFavorites();
  } catch (error) {
    // Возвращаем fallback значения если tRPC недоступен
    return {
      favorites: [],
      favoritesCount: 0,
      isLoading: false,
      isFavorite: () => false,
      toggleFavorite: () => { },
      addToFavorites: () => { },
      removeFromFavorites: () => { },
      clearFavorites: () => { },
      syncGuestFavorites: () => { },
      isAddingToFavorites: false,
      isRemovingFromFavorites: false,
      isSyncing: false,
      error: null,
      isLocal: true,
      guestId: null,
    };
  }
}
