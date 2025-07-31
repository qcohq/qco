import type { TRPCRouterRecord } from "@trpc/server";
import { create } from "./create";
import { list } from "./list";
import { update } from "./update";
import { deleteItem } from "./delete";
import { getById } from "./get-by-id";
import { checkSlugUniqueness } from "./check-slug-uniqueness";

export const productTypesRouter = {
    create,
    list,
    update,
    delete: deleteItem,
    getById,
    checkSlugUniqueness,
} satisfies TRPCRouterRecord; 