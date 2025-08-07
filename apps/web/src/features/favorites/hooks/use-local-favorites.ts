"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface LocalFavorite {
  productId: string;
  addedAt: string;
  name?: string;
  price?: number;
  image?: string;
}

interface UseLocalFavoritesReturn {
  favorites: LocalFavorite[];
  favoritesCount: number;
  isFavorite: (productId: string) => boolean;
  addToFavorites: (
    productId: string,
    productData?: Partial<LocalFavorite>,
  ) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (
    productId: string,
    productData?: Partial<LocalFavorite>,
  ) => void;
  clearFavorites: () => void;
  isLoading: boolean;
  error: Error | null;
}

const LOCAL_STORAGE_KEY = "qco_local_favorites";

export function useLocalFavorites(): UseLocalFavoritesReturn {
  const [favorites, setFavorites] = useState<LocalFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Загрузка избранного из localStorage при инициализации
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error("Ошибка загрузки избранного из localStorage:", err);
      setError(
        err instanceof Error ? err : new Error("Ошибка загрузки избранного"),
      );
      // Очищаем поврежденные данные
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
      } catch (err) {
        console.error("Ошибка сохранения избранного в localStorage:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Ошибка сохранения избранного"),
        );
      }
    }
  }, [favorites, isLoading]);

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.some((fav) => fav.productId === productId);
    },
    [favorites],
  );

  const addToFavorites = useCallback(
    (productId: string, productData?: Partial<LocalFavorite>) => {
      setFavorites((prev) => {
        if (prev.some((fav) => fav.productId === productId)) {
          return prev; // Уже в избранном
        }

        const newFavorite: LocalFavorite = {
          productId,
          addedAt: new Date().toISOString(),
          ...productData,
        };

        toast.success("Товар добавлен в избранное");
        return [...prev, newFavorite];
      });
    },
    [],
  );

  const removeFromFavorites = useCallback((productId: string) => {
    setFavorites((prev) => {
      const filtered = prev.filter((fav) => fav.productId !== productId);
      if (filtered.length !== prev.length) {
        toast.success("Товар удален из избранного");
      }
      return filtered;
    });
  }, []);

  const toggleFavorite = useCallback(
    (productId: string, productData?: Partial<LocalFavorite>) => {
      if (isFavorite(productId)) {
        removeFromFavorites(productId);
      } else {
        addToFavorites(productId, productData);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites],
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    toast.success("Избранное очищено");
  }, []);

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    isLoading,
    error,
  };
}
