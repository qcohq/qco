import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartSession } from "@/features/cart/hooks/use-cart-session";
import { useTRPC } from "@/trpc/react";

interface AddToCartParams {
  productId: string;
  variantId?: string;
  quantity?: number;
  attributes?: {
    size?: string;
    color?: string;
  };
}

export function useAddToCart() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { sessionId, cartId } = useCartSession();

  // Создаем опции мутации с помощью mutationOptions
  const addToCartMutationOptions = trpc.cart.addItem.mutationOptions({
    onSuccess: (data) => {
      // Инвалидируем кэш запроса корзины
      queryClient.invalidateQueries({
        queryKey: trpc.cart.getCart.queryKey({ cartId, sessionId }),
      });

      // Показываем уведомление об успехе
      toast.success("Товар успешно добавлен в корзину");
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось добавить товар в корзину");
    },
  });

  // Используем опции с хуком useMutation
  const { mutate, isPending, error } = useMutation(addToCartMutationOptions);

  const addToCart = (params: AddToCartParams) => {
    mutate({
      sessionId: sessionId || undefined,
      productId: params.productId,
      variantId: params.variantId,
      quantity: params.quantity || 1,
      attributes: params.attributes,
    });
  };

  return {
    addToCart,
    isPending,
    error,
  };
}
