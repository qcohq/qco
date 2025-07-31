import { z } from "zod";
import { eq, asc } from "@qco/db";
import { productVariants } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

const getVariantsSchema = z.object({
  productId: z.string(),
});

export const getVariants = protectedProcedure
  .input(getVariantsSchema)
  .query(async ({ ctx, input }) => {
    const { productId } = input;
    const variants = await ctx.db.query.productVariants.findMany({
      where: eq(productVariants.productId, productId),
      orderBy: asc(productVariants.name),
    });
    return variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      stock: variant.stock,
      minStock: variant.minStock,
      sku: variant.sku,
      barcode: variant.barcode,
      salePrice: variant.salePrice,
      costPrice: variant.costPrice,
      weight: variant.weight,
      width: variant.width,
      height: variant.height,
      depth: variant.depth,
      isActive: variant.isActive,
      isDefault: variant.isDefault,
    }));
  });
