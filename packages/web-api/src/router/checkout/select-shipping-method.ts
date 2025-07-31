import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { setShippingMethod } from "../../lib/checkout/checkout-helpers";

const shippingMethodSchema = z.object({
	shippingMethodId: z.string(),
});

/**
 * Выбор способа доставки для заказа аутентифицированного пользователя
 */
export const selectShippingMethod = protectedProcedure
	.input(shippingMethodSchema)
	.mutation(async ({ ctx, input }) => {
		try {
			const userId = ctx.session.user.id;
			const result = await setShippingMethod(userId, input.shippingMethodId as "standard" | "express" | "pickup" | "same_day");

			if (!result || result.length === 0) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Could not update shipping method",
				});
			}

			return result[0];
		} catch (error: unknown) {
			if (error instanceof TRPCError) throw error;
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to update shipping method",
				cause: error,
			});
		}
	});
