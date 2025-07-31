import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { customerAddresses } from "@qco/db/schema";
import { and, eq } from "@qco/db";

export const deleteAddress = protectedProcedure
  .input(
    z.object({
      addressId: z.string().min(1, "ID адреса обязателен"),
    }),
  )
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
      const [deletedAddress] = await ctx.db
        .delete(customerAddresses)
        .where(
          and(
            eq(customerAddresses.id, input.addressId),
            eq(customerAddresses.customerId, userId),
          ),
        )
        .returning();

      if (!deletedAddress) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Address not found or you do not have permission to delete it.",
        });
      }

      return {
        success: true,
        message: "Address deleted successfully",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete address",
      });
    }
  });
