import { protectedProcedure } from "../../../trpc";
import { SetDefaultPaymentMethodSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const setDefaultPaymentMethod = protectedProcedure
  .input(SetDefaultPaymentMethodSchema)
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
      // TODO: Replace with actual payment method update logic when payment methods table is created
      // const paymentMethod = await ctx.db.query.paymentMethods.findFirst({
      //   where: and(eq(paymentMethods.id, input.paymentMethodId), eq(paymentMethods.customerId, userId)),
      // });

      // if (!paymentMethod) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "Payment method not found",
      //   });
      // }

      // // Unset all other default payment methods
      // await ctx.db.update(paymentMethods)
      //   .set({ isDefault: false, updatedAt: new Date() })
      //   .where(and(eq(paymentMethods.customerId, userId), eq(paymentMethods.isDefault, true)));

      // // Set the selected payment method as default
      // await ctx.db.update(paymentMethods)
      //   .set({ isDefault: true, updatedAt: new Date() })
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
        message: "Failed to update default payment method",
      });
    }
  });
