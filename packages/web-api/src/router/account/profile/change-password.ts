import { protectedProcedure } from "../../../trpc";
import { ChangePasswordSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@qco/web-auth";
import { customerAccounts } from "@qco/db/schema";
import { and, eq } from "@qco/db";

export const changePassword = protectedProcedure
  .input(ChangePasswordSchema)
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  )
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

      const userAccount = await ctx.db.query.customerAccounts.findFirst({
        where: and(
          eq(customerAccounts.userId, userId),
          eq(customerAccounts.providerId, "email"),
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
        .update(customerAccounts)
        .set({ password: hashedNewPassword, updatedAt: new Date() })
        .where(eq(customerAccounts.id, userAccount.id));

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
