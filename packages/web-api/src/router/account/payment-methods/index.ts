import type { TRPCRouterRecord } from "@trpc/server";
import { getPaymentMethods } from "./get-payment-methods";
import { createPaymentMethod } from "./create-payment-method";
import { deletePaymentMethod } from "./delete-payment-method";
import { setDefaultPaymentMethod } from "./set-default-payment-method";

export const paymentMethodsRouter = {
  getPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} satisfies TRPCRouterRecord;
