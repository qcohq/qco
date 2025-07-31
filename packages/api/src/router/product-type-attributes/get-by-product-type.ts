import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { productTypeAttributes } from "@qco/db/schema";
import { getProductTypeAttributesByTypeSchema } from "@qco/validators";
import { eq } from "@qco/db";

export const getByProductType = protectedProcedure
  .input(getProductTypeAttributesByTypeSchema)
  .query(async ({ ctx, input }) => {
    const { productTypeId } = input;

    const attributes = await ctx.db.query.productTypeAttributes.findMany({
      where: eq(productTypeAttributes.productTypeId, productTypeId),
      orderBy: (productTypeAttributes, { asc }) => [asc(productTypeAttributes.sortOrder), asc(productTypeAttributes.name)],
    });

    return {
      items: attributes,
      count: attributes.length,
    };
  });
