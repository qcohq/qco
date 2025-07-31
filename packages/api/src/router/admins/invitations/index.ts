import type { TRPCRouterRecord } from "@trpc/server";

import { create } from "./create";
import { resend } from "./resend";
import { list } from "./list";
import { cancel } from "./cancel";
import { getByToken } from "./get-by-token";
import { acceptInvitationRouter } from "./accept";

export const invitationsRouter = {
  create,
  resend,
  list,
  cancel,
  getByToken,
  accept: acceptInvitationRouter.accept,
} satisfies TRPCRouterRecord;
