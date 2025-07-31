import { protectedProcedure } from '../../trpc';
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import { updateCustomerInfo as updateCustomer } from "../../lib/checkout/customer-helpers";

const customerInfoSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

/**
 * Обновление информации о клиенте для аутентифицированного пользователя
 */
export const updateCustomerInfo = protectedProcedure
  .input(customerInfoSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const userId = ctx.session.user.id;
      const result = await updateCustomer(userId, input);
      
      if (!result || result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found or could not be updated"
        });
      }
      
      return result[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update customer information",
        cause: error
      });
    }
  });
