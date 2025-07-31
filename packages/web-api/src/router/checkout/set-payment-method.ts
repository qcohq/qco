import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { setPaymentMethod as updatePaymentMethod } from "../../lib/checkout/checkout-helpers";

const paymentMethodSchema = z.object({
	paymentMethodId: z.string(),
});

/**
 * Set payment method for the authenticated user.
 */
export const setPaymentMethod = protectedProcedure
	.input(paymentMethodSchema)
	.mutation(async ({ ctx, input }) => {
		try {
			const userId = ctx.session.user.id;
			const result = await updatePaymentMethod(userId, input.paymentMethodId as "credit_card" | "bank_transfer" | "cash_on_delivery" | "digital_wallet");

			if (!result || result.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Could not update payment method"
				});
			}

			return result[0];
		} catch (error: unknown) {
			if (error instanceof TRPCError) throw error;
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update payment method",
				cause: error
			});
		}
	});
