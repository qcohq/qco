import { protectedProcedure } from "../../../trpc";
import { PaymentMethodsSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

export const getPaymentMethods = protectedProcedure
  .output(PaymentMethodsSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // TODO: Replace with actual database query when payment methods table is created
      // const paymentMethods = await ctx.db.query.paymentMethods.findMany({
      //   where: eq(paymentMethods.customerId, userId),
      //   orderBy: [desc(paymentMethods.isDefault), desc(paymentMethods.createdAt)],
      // });

      // Mock data for now - возвращаем пустой массив, так как нет таблицы платежных методов
      const mockPaymentMethods: z.infer<typeof PaymentMethodsSchema> = [];

      return mockPaymentMethods;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch payment methods",
      });
    }
  });
