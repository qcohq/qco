import { protectedProcedure } from "../../../trpc";
import { AccountAddressesSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { customerAddresses } from "@qco/db/schema";
import { eq, desc, asc } from "@qco/db";

export const getAddresses = protectedProcedure
  .output(AccountAddressesSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const addresses = await ctx.db.query.customerAddresses.findMany({
        where: eq(customerAddresses.customerId, userId),
        orderBy: [desc(customerAddresses.isDefault), asc(customerAddresses.createdAt)],
      });

      return addresses.map((address) => ({
        id: address.id,
        customerId: address.customerId,
        type: address.type,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
        notes: address.notes,
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch addresses",
      });
    }
  });
