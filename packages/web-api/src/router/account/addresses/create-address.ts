import { protectedProcedure } from "../../../trpc";
import { CreateAddressSchema, AccountAddressSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { customerAddresses } from "@qco/db/schema";
import { and, eq } from "@qco/db";

export const createAddress = protectedProcedure
  .input(CreateAddressSchema)
  .output(AccountAddressSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // Если адрес помечен как дефолтный, сбрасываем дефолтный статус у других адресов
      if (input.isDefault) {
        await ctx.db
          .update(customerAddresses)
          .set({ isDefault: false })
          .where(
            and(
              eq(customerAddresses.customerId, userId),
              eq(customerAddresses.type, input.type)
            )
          );
      }

      const [newAddress] = await ctx.db
        .insert(customerAddresses)
        .values({
          customerId: userId,
          type: input.type,
          firstName: input.firstName,
          lastName: input.lastName,
          company: input.company || null,
          phone: input.phone || null,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 || null,
          city: input.city,
          state: input.state || null,
          postalCode: input.postalCode,
          country: input.country,
          isDefault: input.isDefault,
          notes: input.notes || null,
        })
        .returning();

      if (!newAddress) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create address",
        });
      }

      return {
        id: newAddress.id,
        customerId: newAddress.customerId,
        type: newAddress.type,
        firstName: newAddress.firstName,
        lastName: newAddress.lastName,
        company: newAddress.company,
        phone: newAddress.phone,
        addressLine1: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        state: newAddress.state,
        postalCode: newAddress.postalCode,
        country: newAddress.country,
        isDefault: newAddress.isDefault,
        notes: newAddress.notes,
        createdAt: newAddress.createdAt,
        updatedAt: newAddress.updatedAt,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create address",
      });
    }
  });
