import type { TRPCRouterRecord } from "@trpc/server";
import { create } from "./create";
import { deleteDeliverySettings } from "./delete";
import { getAll } from "./get-all";
import { getById } from "./get-by-id";
import { update } from "./update";

export const deliverySettingsRouter = {
    getAll,
    getById,
    create,
    update,
    delete: deleteDeliverySettings,
} satisfies TRPCRouterRecord; 
