import { protectedProcedure } from "../../../trpc";
import { DeleteAccountSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { auth } from "@qco/web-auth";
import { customers, customerAccounts } from "@qco/db/schema";
import { and, eq } from "@qco/db";

export const deleteAccount = protectedProcedure
  .input(DeleteAccountSchema)
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

      if (userAccount?.password) {
        const isPasswordValid = await authContext.password.verify({
          password: input.password,
          hash: userAccount.password,
        });
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Password is incorrect",
          });
        }
      }

      await ctx.db.delete(customers).where(eq(customers.id, userId));

      return {
        success: true,
        message: "Account deleted successfully",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete account",
      });
    }
  });
