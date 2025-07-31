import { eq } from "@qco/db";
import { orders } from "@qco/db/schema";
import { db } from "@qco/db/client";


export type OrderResult = {
	id: string;
	[key: string]: unknown;
}[];


/**
 * Set shipping method for an order
 */
export async function setShippingMethod(
	userId: string,
	shippingMethod: "standard" | "express" | "same_day" | "pickup",
): Promise<OrderResult> {
	try {
		return db
			.update(orders)
			.set({ shippingMethod })
			.where(eq(orders.customerId, userId))
			.returning()
			.execute();
	} catch (error) {

		throw error;
	}
}

/**
 * Set payment method for an order
 */
export async function setPaymentMethod(
	userId: string,
	paymentMethod: "credit_card" | "bank_transfer" | "cash_on_delivery" | "digital_wallet",
): Promise<OrderResult> {
	try {
		return db
			.update(orders)
			.set({ paymentMethod })
			.where(eq(orders.customerId, userId))
			.returning()
			.execute();
	} catch (error) {

		throw error;
	}
}
