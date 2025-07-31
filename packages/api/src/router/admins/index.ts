import type { TRPCRouterRecord } from "@trpc/server";

import { create } from "./create";
import { createSuperAdminRouter } from "./create-super-admin";
import { list } from "./list";
import { getById } from "./getById";
import { update } from "./update";
import { deleteAdmin } from "./delete";
import { bulkDelete } from "./bulk-delete";
import { changeRole } from "./change-role";
import { toggleStatus } from "./toggle-status";
import { checkEmpty } from "./check-empty";
import { stats } from "./stats";
import { invitationsRouter } from "./invitations";

export const adminsRouter = {
  create,
  list,
  getById,
  update,
  delete: deleteAdmin,
  bulkDelete,
  changeRole,
  toggleStatus,
  checkEmpty,
  stats,
  invitations: invitationsRouter,
  createSuperAdmin: createSuperAdminRouter.create,
} satisfies TRPCRouterRecord; 
