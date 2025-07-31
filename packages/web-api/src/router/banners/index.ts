import type { TRPCRouterRecord } from "@trpc/server";
import { getByPosition } from "./get-by-position";
import { getActive } from "./get-active";

export const bannersRouter = {
  getByPosition,
  getActive,
} satisfies TRPCRouterRecord; 
