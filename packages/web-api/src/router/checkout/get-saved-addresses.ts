import { TRPCError } from "@trpc/server";
import { protectedProcedure } from '../../trpc';
import { getCustomerAddresses } from "../../lib/checkout/customer-helpers";

/**
 * Получение сохраненных адресов для аутентифицированного пользователя
 */
export const getSavedAddresses = protectedProcedure.query(async ({ ctx }) => {
  try {
    const userId = ctx.session.user.id;
    return await getCustomerAddresses(userId);
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve saved addresses",
      cause: error
    });
  }
});
