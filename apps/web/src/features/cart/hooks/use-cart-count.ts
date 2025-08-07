"use client";

import { useQuery } from "@tanstack/react-query";
import { useCartSession } from "./use-cart-session";
import { useTRPC } from "@/trpc/react";

export function useCartCount() {
  const trpc = useTRPC();
  const { sessionId } = useCartSession();

  // Создаем опции запроса для получения корзины
  const cartQueryOptions = trpc.cart.getCart.queryOptions({
    sessionId,
  });

  // Используем опции с хуком useQuery
  const { data: cart, isPending, error } = useQuery(cartQueryOptions);

  return {
    itemCount: cart?.items?.length || 0,
    isLoading: isPending,
    error,
  };
}

// Безопасная версия хука, которая не вызывает tRPC если он недоступен
export function useCartCountSafe() {
  // Всегда вызываем хуки на верхнем уровне
  const trpc = useTRPC();
  const { sessionId } = useCartSession();

  // Проверяем, есть ли sessionId для запроса
  const hasSessionId = !!sessionId;

  // Создаем опции запроса для получения корзины только если есть sessionId
  const cartQueryOptions = trpc.cart.getCart.queryOptions({
    sessionId,
  }, {
    enabled: hasSessionId
  })

  // Используем опции с хуком useQuery только если они есть
  const { data: cart, isPending, error } = useQuery(cartQueryOptions);

  // Если нет sessionId или есть ошибка, возвращаем 0
  if (!hasSessionId || error) {
    return {
      itemCount: 0,
      isLoading: false,
      error: null,
    };
  }

  const count = cart?.items?.length || 0;

  return {
    itemCount: count,
    isLoading: isPending,
    error,
  };
}
