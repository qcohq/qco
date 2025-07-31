import { z } from "zod";
import { eq, inArray } from "@qco/db";
import { productVariants } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

const updatePricesSchema = z.object({
  variantIds: z.array(z.string()),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
});

export const updatePrices = protectedProcedure
  .input(updatePricesSchema)
  .mutation(async ({ ctx, input }) => {
    const { variantIds, price, salePrice, costPrice } = input;

    const updateData: any = {};

    if (price !== undefined) {
      updateData.price = price.toString();
    }

    if (salePrice !== undefined) {
      updateData.salePrice = salePrice.toString();
    }

    if (costPrice !== undefined) {
      updateData.costPrice = costPrice.toString();
    }

    const updatedVariants = await ctx.db.update(productVariants).set(updateData).where(inArray(productVariants.id, variantIds)).returning();

    return updatedVariants;
  }); 
