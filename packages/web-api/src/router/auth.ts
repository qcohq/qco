import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../trpc";
import { verifyEmail } from "./auth/verify-email";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  verifyEmail,
} satisfies TRPCRouterRecord;
