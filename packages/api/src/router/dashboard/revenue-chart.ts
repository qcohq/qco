import { eq, and, gte, lt, sql } from "@qco/db"
import { orders } from "@qco/db/schema"
import { revenueDataArraySchema } from "@qco/validators"

import { protectedProcedure } from "../../trpc"
import type { TRPCContext } from "../../trpc"

export const revenueChart = protectedProcedure.query(
  async ({ ctx }: { ctx: TRPCContext }) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get revenue for each day of the week
    const revenueData = [];
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const startOfDay = new Date(weekAgo);
      startOfDay.setDate(startOfDay.getDate() + i);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const dayRevenue = await ctx.db
        .select({
          revenue: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)`,
        })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, startOfDay),
            lt(orders.createdAt, endOfDay),
            eq(orders.status, "delivered"),
          ),
        );

      revenueData.push({
        date: daysOfWeek[i],
        revenue: Number(dayRevenue[0]?.revenue ?? 0),
      });
    }

    const validatedData = revenueDataArraySchema.parse(revenueData);
    return validatedData;
  },
);
