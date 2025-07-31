import { protectedProcedure } from "../../../trpc";
import { AccountProfileSchema } from "@qco/web-validators";
import { customers } from "@qco/db/schema";
import { eq } from "@qco/db";
import { TRPCError } from "@trpc/server";

export const getProfile = protectedProcedure
  .output(AccountProfileSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const customer = await ctx.db.query.customers.findFirst({
        where: eq(customers.id, userId),
      });

      if (!customer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      return {
        id: customer.id,
        customerCode: customer.customerCode,
        name: customer.name,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        emailVerified: customer.emailVerified,
        phone: customer.phone,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        image: customer.image,
        isGuest: customer.isGuest,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profile",
      });
    }
  });
