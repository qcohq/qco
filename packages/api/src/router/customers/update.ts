import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { customers, customerAddresses } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import type { NewCustomerType, CustomerType } from "@qco/db/schema";
import { updateCustomerSchema } from "@qco/validators";

export const updateCustomer = protectedProcedure
  .input(updateCustomerSchema)
  .mutation(async ({ ctx, input }): Promise<CustomerType | undefined> => {
    const { id, data } = input;

    // Check if customer exists
    const existingCustomer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    if (!existingCustomer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found",
      });
    }

    // Update customer data
    const updateData: Partial<NewCustomerType> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.dateOfBirth !== undefined) updateData.dateOfBirth = data.dateOfBirth;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.image !== undefined) updateData.image = data.image;

    await ctx.db.update(customers).set(updateData).where(eq(customers.id, id));

    // Update addresses if provided
    if (data.addresses && data.addresses.length > 0) {
      // Delete existing addresses
      await ctx.db.delete(customerAddresses).where(eq(customerAddresses.customerId, id));

      // Insert new addresses
      for (const address of data.addresses) {
        await ctx.db.insert(customerAddresses).values({
          customerId: id,
          type: address.type,
          firstName: address.firstName,
          lastName: address.lastName,
          company: address.company,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
          isDefault: address.isDefault || false,
          notes: address.notes,
        });
      }
    }

    // Get updated customer
    const updatedCustomer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    return updatedCustomer;
  });
