import { protectedProcedure } from "../../trpc";
import { adminChangePasswordSchema } from "@qco/validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@qco/auth";
import { accounts } from "@qco/db/schema";
import { and, eq } from "@qco/db";

export const changePassword = protectedProcedure
    .input(adminChangePasswordSchema)
    .output(z.object({
        success: z.boolean(),
        message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        try {
            const authContext = await auth.$context;

            const userAccount = await ctx.db.query.accounts.findFirst({
                where: and(
                    eq(accounts.userId, userId),
                    eq(accounts.providerId, "email"),
                ),
            });

            if (!userAccount?.password) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        "User does not have a password with this account. Try resetting the password.",
                });
            }

            const isCurrentPasswordValid = await authContext.password.verify({
                password: input.currentPassword,
                hash: userAccount.password,
            });

            if (!isCurrentPasswordValid) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Current password is incorrect",
                });
            }

            const hashedNewPassword = await authContext.password.hash(
                input.newPassword,
            );

            await ctx.db
                .update(accounts)
                .set({ password: hashedNewPassword, updatedAt: new Date() })
                .where(eq(accounts.id, userAccount.id));

            return {
                success: true,
                message: "Password changed successfully",
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to change password",
            });
        }
    }); 
