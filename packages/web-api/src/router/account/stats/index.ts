import type { TRPCRouterRecord } from "@trpc/server";
import { getStats } from "./get-stats";

export const statsRouter = {
  getStats,
} satisfies TRPCRouterRecord;
