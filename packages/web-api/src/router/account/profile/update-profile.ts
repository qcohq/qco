import { protectedProcedure } from "../../../trpc";
import { UpdateProfileSchema, AccountProfileSchema } from "@qco/web-validators";
import { customers } from "@qco/db/schema";
import { eq } from "@qco/db";
import { TRPCError } from "@trpc/server";

export const updateProfile = protectedProcedure
  .input(UpdateProfileSchema)
  .output(AccountProfileSchema)
  .mutation(async ({ ctx, input }) => {
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

      const [updatedCustomer] = await ctx.db
        .update(customers)
        .set({
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, userId))
        .returning();

      if (!updatedCustomer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }

      return {
        id: updatedCustomer.id,
        customerCode: updatedCustomer.customerCode,
        name: updatedCustomer.name,
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        emailVerified: updatedCustomer.emailVerified,
        phone: updatedCustomer.phone,
        dateOfBirth: updatedCustomer.dateOfBirth,
        gender: updatedCustomer.gender,
        image: updatedCustomer.image,
        isGuest: updatedCustomer.isGuest,
        createdAt: updatedCustomer.createdAt,
        updatedAt: updatedCustomer.updatedAt,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update profile",
      });
    }
  });
