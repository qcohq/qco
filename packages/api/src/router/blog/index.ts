import type { TRPCRouterRecord } from "@trpc/server";
import { create } from "./create";
import { update } from "./update";
import { getById } from "./get-by-id";
import { getBySlug } from "./get-by-slug";
import { getAll } from "./get-all";

export const blogRouter = {
    create,
    update,
    getById,
    getBySlug,
    getAll,

} satisfies TRPCRouterRecord; 
