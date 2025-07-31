import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { customers, customerAccounts, customerSessions, customerAddresses } from "@qco/db/schema";
import { orders } from "@qco/db/schema";
import { favorites } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { deleteCustomerSchema } from "@qco/validators";

export const deleteCustomer = protectedProcedure
  .input(deleteCustomerSchema)
  .mutation(async ({ ctx, input }): Promise<{ success: boolean }> => {
    const { id } = input;

    // Проверяем существование клиента
    const existingCustomer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    if (!existingCustomer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found",
      });
    }

    try {
      // Удаляем связанные записи в правильном порядке (из-за внешних ключей)
      await ctx.db.delete(favorites).where(eq(favorites.customerId, id));
      await ctx.db.delete(orders).where(eq(orders.customerId, id));
      await ctx.db.delete(customerAddresses).where(eq(customerAddresses.customerId, id));
      await ctx.db.delete(customerSessions).where(eq(customerSessions.userId, id));
      await ctx.db.delete(customerAccounts).where(eq(customerAccounts.userId, id));

      // Удаляем клиента
      await ctx.db.delete(customers).where(eq(customers.id, id));

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete customer and related data",
      });
    }
  });
