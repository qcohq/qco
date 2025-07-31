import { TRPCError } from "@trpc/server";
import { getOrderByIdSchema } from "@qco/web-validators";
import { publicProcedure } from "../../trpc";
import { getOrderById } from "../../lib/orders/order-helpers";

/**
 * Получение заказа по ID
 */
export const getOrderProcedure = publicProcedure
  .input(getOrderByIdSchema)
  .query(async ({ input }) => {
    const { orderId } = input;

    // Валидация orderId
    if (!orderId || orderId.trim() === "") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Order ID is required",
      });
    }

    try {
      // Получаем заказ по ID
      const order = await getOrderById(orderId);

      // Проверка на существование заказа уже выполняется в getOrderById,
      // но добавляем дополнительную проверку для надежности
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Order with ID "${orderId}" not found`,
        });
      }

      return order;
    } catch (error: unknown) {
      console.error("Error in getOrderProcedure:", error);

      if (error instanceof TRPCError) {
        throw error;
      }

      // Логируем детали ошибки для отладки
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
          orderId,
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve order",
        cause: error,
      });
    }
  });

// Экспорт только getOrderProcedure
