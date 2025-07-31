import { TRPCError } from "@trpc/server";
import { protectedProcedure } from '../../trpc';
import { getCustomerById } from "../../lib/checkout/customer-helpers";

/**
 * Получение информации о клиенте для аутентифицированного пользователя
 */
export const getCustomerInfo = protectedProcedure.query(async ({ ctx }) => {
  try {
    const userId = ctx.session.user.id;
    const customer = await getCustomerById(userId);
    
    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found"
      });
    }
    
    return customer;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve customer info",
      cause: error
    });
  }
});
