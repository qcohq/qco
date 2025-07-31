import { protectedProcedure } from "../../../trpc";
import {
  CreatePaymentMethodSchema,
  PaymentMethodSchema,
} from "@qco/web-validators";
import { TRPCError } from "@trpc/server";

export const createPaymentMethod = protectedProcedure
  .input(CreatePaymentMethodSchema)
  .output(PaymentMethodSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // TODO: Replace with actual payment method creation logic when payment methods table is created
      // If setting as default, unset other default methods first
      // if (input.isDefault) {
      //   await ctx.db.update(paymentMethods)
      //     .set({ isDefault: false })
      //     .where(and(eq(paymentMethods.customerId, userId), eq(paymentMethods.isDefault, true)));
      // }

      // Create new payment method
      // const [newPaymentMethod] = await ctx.db.insert(paymentMethods).values({
      //   customerId: userId,
      //   type: input.type,
      //   name: input.name,
      //   cardNumber: input.cardNumber,
      //   cardExpiry: input.cardExpiry,
      //   isDefault: input.isDefault,
      //   brand: input.brand,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // }).returning();

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
        message: "Failed to create payment method",
      });
    }
  });
