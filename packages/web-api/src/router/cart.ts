import type { TRPCRouterRecord } from "@trpc/server";
import { addItem } from "./cart/add-item";
import { clearCart } from "./cart/clear-cart";
import { getCart } from "./cart/get-cart";
import { removeItem } from "./cart/remove-item";
import { updateItem } from "./cart/update-item";

export const cartRouter = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} satisfies TRPCRouterRecord;
