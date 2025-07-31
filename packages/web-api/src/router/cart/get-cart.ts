import { getCartSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { getCartWithItems } from "../../lib/cart/cart-helpers";
import { publicProcedure } from "../../trpc";

/**
 * Получение корзины по ID или ID сессии
 */
export const getCart = publicProcedure
  .input(getCartSchema)
  .query(async ({ input }) => {
    const { cartId, sessionId } = input;

    try {
      // Проверяем, что передан хотя бы один идентификатор
      if (!cartId && !sessionId) {
        return null;
      }

      // Если передан ID корзины, получаем корзину по нему
      if (cartId) {
        const cart = await getCartWithItems(cartId);
        return cart;
      }

      // Если передан только ID сессии, ищем корзину по нему
      // Для этого нам нужно сначала найти ID корзины
      const { findCartBySessionId } = await import(
        "../../lib/cart/cart-helpers"
      );

      // Проверяем, что sessionId определен
      if (!sessionId) {
        return null;
      }

      const cartData = await findCartBySessionId(sessionId);

      if (!cartData?.id) {
        return null;
      }

      return await getCartWithItems(cartData.id);
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve cart",
      });
    }
  });
