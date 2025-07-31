import type { TRPCRouterRecord } from "@trpc/server";
import { getAddresses } from "./get-addresses";
import { createAddress } from "./create-address";
import { updateAddress } from "./update-address";
import { deleteAddress } from "./delete-address";

export const addressesRouter = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} satisfies TRPCRouterRecord;
