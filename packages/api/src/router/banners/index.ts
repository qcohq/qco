import type { TRPCRouterRecord } from "@trpc/server";

import { create } from "./create";
import { getAll } from "./get-all";
import { getById } from "./get-by-id";
import { update } from "./update";
import { deleteBanner } from "./delete";
import { bulkDeleteBanners } from "./bulk-delete";
import { addFile } from "./add-file";
import { removeFile } from "./remove-file";
import { updateFilesOrder } from "./update-files-order";

export const bannersRouter = {
  create,
  getAll,
  getById,
  update,
  delete: deleteBanner,
  bulkDelete: bulkDeleteBanners,
  addFile,
  removeFile,
  updateFilesOrder,
} satisfies TRPCRouterRecord;
