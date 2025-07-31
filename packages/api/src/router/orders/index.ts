import { createTRPCRouter } from "../../trpc";
import { byId } from "./by-id";
import { cancel } from "./cancel";
import { create } from "./create";
import { getByCustomer } from "./get-by-customer";
import { list } from "./list";
import { printOrder } from "./print";
import { removeOrder } from "./remove";
import { updateDeliveryStatus } from "./update-delivery-status";
import { updatePaymentStatus } from "./update-payment-status";
import { updateStatus } from "./update-status";
import { updateTracking } from "./update-tracking";
import { stats } from "./stats";

export const ordersRouter = createTRPCRouter({
  byId,
  cancel,
  create,
  getByCustomer,
  list,
  printOrder,
  removeOrder,
  updateDeliveryStatus,
  updatePaymentStatus,
  updateStatus,
  updateTracking,
  stats,
});
