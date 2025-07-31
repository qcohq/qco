import { getPublished } from "./get-published";
import { getBySlug } from "./get-by-slug";
import { getFeatured } from "./get-featured";
import type { TRPCRouterRecord } from "@trpc/server";

export const blogRouter = {
  getPublished,
  getBySlug,
  getFeatured,
} satisfies TRPCRouterRecord; 
