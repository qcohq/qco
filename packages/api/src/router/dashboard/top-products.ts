import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../trpc"
import { topProductsArraySchema } from "@qco/validators"
import { and, eq, gte, sql, desc } from "@qco/db"
import { orderItems, orders, products } from "@qco/db/schema"

export const getTopProducts = protectedProcedure
  .output(topProductsArraySchema)
  .query(async ({ ctx }) => {
    try {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      // Get products with real sales data for the last month
      const productsWithSales = await ctx.db
        .select({
          id: products.id,
          name: products.name,
          sales: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
          revenue: sql<number>`COALESCE(SUM(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`,
        })
        .from(products)
        .leftJoin(orderItems, eq(products.id, orderItems.productId))
        .leftJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(products.isActive, true),
            gte(orders.createdAt, oneMonthAgo),
            eq(orders.status, "delivered")
          )
        )
        .groupBy(products.id, products.name)
        .orderBy(desc(sql`COALESCE(SUM(${orderItems.quantity} * ${orderItems.unitPrice}), 0)`))
        .limit(10);

      // Transform data to match the expected schema
      const transformedProducts = productsWithSales.map(product => ({
        id: product.id,
        name: product.name,
        sales: Number(product.sales),
        revenue: Number(product.revenue),
        image: undefined, // No image for now
      }));

      return transformedProducts;
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch top products",
      });
    }
  });
