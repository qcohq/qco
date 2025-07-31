import type { TRPCRouterRecord } from "@trpc/server";
import { getFavorites } from "./get-favorites";
import { addToFavorites } from "./add-to-favorites";
import { removeFromFavorites } from "./remove-from-favorites";
import { checkFavoriteStatus } from "./check-favorite-status";

export const favoritesRouter = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  checkFavoriteStatus,
} satisfies TRPCRouterRecord;
