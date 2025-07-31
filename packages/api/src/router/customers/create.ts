import { TRPCError } from "@trpc/server";
import { customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { createCustomerSchema } from "@qco/validators";

export const create = protectedProcedure
  .input(createCustomerSchema)
  .mutation(async ({ ctx, input }) => {
    const customerCode = `CUST-${Date.now()}`;
    const [customer] = await ctx.db.insert(customers).values({
      ...input,
      customerCode,
    }).returning();

    if (!customer) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to create customer",
      });
    }

    return customer;
  });
