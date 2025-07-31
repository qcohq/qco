import type { TRPCRouterRecord } from "@trpc/server";
import { getOrders } from "./get-orders";
import { getOrderDetail } from "./get-order-detail";

export const ordersRouter = {
  getOrders,
  getOrderDetail,
} satisfies TRPCRouterRecord;
