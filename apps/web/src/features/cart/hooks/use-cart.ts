"use client";

import type { AppRouter } from "@qco/web-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useCartSession } from "./use-cart-session";

export function useCart() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { sessionId, updateCartId } = useCartSession();

  // Получение корзины с оптимизированными настройками кэширования
  const cartQueryOptions = trpc.cart.getCart.queryOptions(
    {
      sessionId,
    },
    {
      staleTime: 2 * 60 * 1000, // 2 минуты
      gcTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false,
    },
  );

  const { data: cart, isLoading, error } = useQuery(cartQueryOptions);

  // Обновляем cartId, если он изменился в ответе сервера
  useEffect(() => {
    if (cart?.id) {
      updateCartId(cart.id);
    }
  }, [cart?.id, updateCartId]);

  // Добавление товара в корзину
  const addItemMutationOptions = trpc.cart.addItem.mutationOptions({
    onSuccess: (data) => {
      // Инвалидируем кэш корзины
      queryClient.invalidateQueries({
        queryKey: trpc.cart.getCart.queryKey({ sessionId }),
      });

      // Показываем уведомление об успехе
      toast.success("Товар успешно добавлен в корзину");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Не удалось добавить товар в корзину");
    },
  });

  const { mutate: addItem, isPending: isAddingItem } = useMutation(
    addItemMutationOptions,
  );

  // Обновление количества товара
  const updateItemMutationOptions = trpc.cart.updateItem.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.cart.getCart.queryKey({ sessionId }),
      });
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Не удалось обновить количество");
    },
  });

  const { mutate: updateItem, isPending: isUpdatingItem } = useMutation(
    updateItemMutationOptions,
  );

  // Удаление товара из корзины
  const removeItemMutationOptions = trpc.cart.removeItem.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.cart.getCart.queryKey({ sessionId }),
      });
      toast.success("Товар удален из корзины");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Не удалось удалить товар");
    },
  });

  const { mutate: removeItem, isPending: isRemovingItem } = useMutation(
    removeItemMutationOptions,
  );

  // Очистка корзины
  const clearCartMutationOptions = trpc.cart.clearCart.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.cart.getCart.queryKey({ sessionId }),
      });
      toast.success("Все товары удалены из корзины");
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error(error.message || "Не удалось очистить корзину");
    },
  });

  const { mutate: clearCart, isPending: isClearingCart } = useMutation(
    clearCartMutationOptions,
  );

  // Используем total с сервера, который уже правильно вычислен с приоритетом salePrice
  const subtotal = cart?.total || 0;

  // Используем itemCount с сервера
  const itemCount = cart?.itemCount || 0;

  // Стоимость доставки (не учтена в общей сумме)
  const shipping = 0; // Стоимость доставки будет рассчитана при оформлении заказа
  const total = subtotal; // Итого без учета доставки

  // Функции для работы с корзиной
  const addToCart = useCallback(
    (
      productId: string,
      quantity = 1,
      variantId?: string,

    ) => {
      addItem({
        sessionId: sessionId || undefined,
        productId,
        quantity,
        variantId,
        attributes,
      });
    },
    [addItem, sessionId],
  );

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (quantity === 0) {
        removeItem({ cartItemId });
      } else {
        updateItem({ cartItemId, quantity });
      }
    },
    [updateItem, removeItem],
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      removeItem({ cartItemId });
    },
    [removeItem],
  );

  return {
    cart,
    isLoading,
    error,
    subtotal,
    shipping,
    total,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddingItem,
    isUpdatingItem,
    isRemovingItem,
    isClearingCart,
  };
}

// Безопасная версия хука для использования вне TRPCProvider
export function useCartSafe() {
  try {
    return useCart();
  } catch (error) {
    // Возвращаем fallback значения если tRPC недоступен
    return {
      cart: null,
      isLoading: false,
      error: null,
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0,
      addToCart: () => { },
      updateQuantity: () => { },
      removeFromCart: () => { },
      clearCart: () => { },
      isAddingItem: false,
      isUpdatingItem: false,
      isRemovingItem: false,
      isClearingCart: false,
    };
  }
}
