import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../trpc";
import { productVariants } from "@qco/db/schema";

const updateVariantSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  minStock: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  depth: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

export const updateVariant = protectedProcedure
  .input(updateVariantSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    const [variant] = await ctx.db
      .update(productVariants)
      .set({
        name: updateData.name,
        sku: updateData.sku,
        barcode: updateData.barcode,
        price: updateData.price?.toString(),
        salePrice: updateData.salePrice?.toString(),
        costPrice: updateData.costPrice?.toString(),
        stock: updateData.stock,
        minStock: updateData.minStock,
        weight: updateData.weight?.toString(),
        width: updateData.width?.toString(),
        height: updateData.height?.toString(),
        depth: updateData.depth?.toString(),
        isActive: updateData.isActive,
        isDefault: updateData.isDefault,
        updatedAt: new Date(),
      })
      .where(eq(productVariants.id, id))
      .returning();

    return variant;
  });
