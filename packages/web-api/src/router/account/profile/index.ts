import type { TRPCRouterRecord } from "@trpc/server";
import { getProfile } from "./get-profile";
import { updateProfile } from "./update-profile";
import { changePassword } from "./change-password";
import { deleteAccount } from "./delete-account";

export const profileRouter = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} satisfies TRPCRouterRecord;
