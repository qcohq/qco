import { TRPCError } from "@trpc/server";
import { protectedProcedure } from '../../trpc';
import { getCustomerPaymentMethods } from "../../lib/checkout/customer-helpers";

/**
 * Получение сохраненных способов оплаты для аутентифицированного пользователя
 */
export const getSavedPaymentMethods = protectedProcedure.query(async ({ ctx }) => {
  try {
    const userId = ctx.session.user.id;
    return await getCustomerPaymentMethods(userId);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve saved payment methods",
      cause: error
    });
  }
});
