import type { TRPCRouterRecord } from "@trpc/server";
export * from "./list";
export * from "./get-by-id";
export * from "./create";
export * from "./update";
export * from "./remove";

import { list } from "./list";
import { getById } from "./get-by-id";
import { create } from "./create";
import { update } from "./update";
import { remove } from "./remove";

export const specificationsRouter = {
    list,
    getById,
    create,
    update,
    remove,
} satisfies TRPCRouterRecord; 