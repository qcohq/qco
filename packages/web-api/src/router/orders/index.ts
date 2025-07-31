import type { TRPCRouterRecord } from "@trpc/server";
import { createOrderProcedure } from "./create-order";
import { getOrderProcedure } from "./get-order";
import { getOrdersProcedure } from "./get-orders";

export const ordersRouter = {
    createOrder: createOrderProcedure,
    getOrder: getOrderProcedure,
    getOrders: getOrdersProcedure,
} satisfies TRPCRouterRecord;
