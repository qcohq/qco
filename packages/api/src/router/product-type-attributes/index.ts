import type { TRPCRouterRecord } from "@trpc/server";
import { create } from "./create";
import { deleteItem } from "./delete";
import { getAll } from "./get-all";
import { getById } from "./get-by-id";
import { getByProductType } from "./get-by-product-type";
import { toggleActive } from "./toggle-active";
import { update } from "./update";

export const productTypeAttributesRouter = {
    create,
    delete: deleteItem,
    getAll,
    getById,
    getByProductType,
    toggleActive,
    update,
} satisfies TRPCRouterRecord;