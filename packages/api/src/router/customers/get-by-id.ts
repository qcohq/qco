import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { customers } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import type { CustomerType } from "@qco/db/schema";
import { getCustomerByIdSchema } from "@qco/validators";

export const getCustomerById = protectedProcedure
  .input(getCustomerByIdSchema)
  .query(async ({ ctx, input }): Promise<CustomerType> => {
    const { id } = input;

    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found",
      });
    }

    return customer;
  });
