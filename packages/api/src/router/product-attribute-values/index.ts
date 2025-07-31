import type { TRPCRouterRecord } from "@trpc/server";
import { getByProductId } from "./get-by-product-id";
import { upsert } from "./upsert";
import { deleteValue } from "./delete";

export const productAttributeValuesRouter = {
    getByProductId,
    upsert,
    delete: deleteValue,
} satisfies TRPCRouterRecord; 