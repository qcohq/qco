import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";
import { getProfile } from "./get-profile";
import { getTeams } from "./get-teams";
import { changePassword } from "./change-password";

export const authRouter = {
    getSession: publicProcedure.query(({ ctx }) => {
        return ctx.session;
    }),
    getSecretMessage: protectedProcedure.query(() => {
        return "you can see this secret message!";
    }),
    getProfile,
    getTeams,
    changePassword,
    signOut: protectedProcedure.mutation(async (opts) => {
        if (!opts.ctx.token) {
            return { success: false };
        }
        return { success: true };
    }),
} satisfies TRPCRouterRecord; 
