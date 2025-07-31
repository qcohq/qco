import { protectedProcedure } from "../../../trpc";
import { DeletePaymentMethodSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const deletePaymentMethod = protectedProcedure
  .input(DeletePaymentMethodSchema)
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // TODO: Replace with actual payment method deletion logic when payment methods table is created
      // const paymentMethod = await ctx.db.query.paymentMethods.findFirst({
      //   where: and(eq(paymentMethods.id, input.paymentMethodId), eq(paymentMethods.customerId, userId)),
      // });

      // if (!paymentMethod) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "Payment method not found",
      //   });
      // }

      // // Don't allow deletion of default payment method if it's the only one
      // if (paymentMethod.isDefault) {
      //   const otherMethods = await ctx.db.query.paymentMethods.findMany({
      //     where: and(eq(paymentMethods.customerId, userId), ne(paymentMethods.id, input.paymentMethodId)),
      //   });
      //
      //   if (otherMethods.length === 0) {
      //     throw new TRPCError({
      //       code: "BAD_REQUEST",
      //       message: "Cannot delete the only payment method",
      //     });
      //   }
      // }

      // // Soft delete the payment method
      // await ctx.db.update(paymentMethods)
      //   .set({ deletedAt: new Date(), updatedAt: new Date() })
      //   .where(eq(paymentMethods.id, input.paymentMethodId));

      // Mock response - возвращаем ошибку, так как нет таблицы платежных методов
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Payment methods functionality not implemented yet",
      });
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete payment method",
      });
    }
  });
