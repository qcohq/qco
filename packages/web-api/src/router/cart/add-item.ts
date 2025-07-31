import { addItemSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import {
  createCartItem,
  findCartItem,
  findOrCreateCart,
  getCartWithItems,
  updateCartItemQuantity,
} from "../../lib/cart/cart-helpers";
import { publicProcedure } from "../../trpc";

/**
 * Процедура добавления товара в корзину
 */
export const addItem = publicProcedure
  .input(addItemSchema)
  .mutation(async ({ input }) => {
    try {
      const { sessionId, productId, variantId, quantity, attributes } = input;

      // Поиск или создание корзины
      const cart = await findOrCreateCart({ sessionId: sessionId || undefined });

      // Проверяем, что ID корзины - строка
      if (typeof cart.id !== "string") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid cart ID",
        });
      }
      const cartId_safe = cart.id;

      // Поиск существующего товара в корзине
      const existingItem = await findCartItem({
        cartId: cartId_safe,
        productId,
        variantId,
      });

      if (existingItem) {
        const itemId_safe = existingItem.id;
        const itemQuantity_safe = existingItem.quantity;

        if (typeof itemId_safe !== "string") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid cart item ID",
          });
        }

        if (typeof itemQuantity_safe !== "number") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid cart item quantity",
          });
        }

        // Обновление количества существующего товара
        await updateCartItemQuantity(itemId_safe, itemQuantity_safe + quantity);
      } else {
        // Создание нового товара в корзине
        await createCartItem({
          cartId: cartId_safe,
          productId,
          variantId,
          quantity,
          attributes: attributes ?? {},
        });
      }

      // Получение обновленной корзины
      const updatedCart = await getCartWithItems(cartId_safe);
      if (!updatedCart) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve updated cart",
        });
      }

      const updatedCartId_safe = updatedCart.id;
      if (typeof updatedCartId_safe !== "string") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid updated cart ID",
        });
      }

      const updatedCartItems_safe = updatedCart.items;
      if (!Array.isArray(updatedCartItems_safe)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Invalid updated cart items",
        });
      }

      return {
        id: updatedCartId_safe,
        items: updatedCartItems_safe,
      };
    } catch (error) {
      // Обработка непредвиденных ошибок
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while adding item to cart",
      });
    }
  });
