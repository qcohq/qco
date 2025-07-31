import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../trpc";
import { productVariants, products } from "@qco/db/schema";

const createVariantSchema = z.object({
  productId: z.string(),
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0).default(0),
  minStock: z.number().int().min(0).default(0),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  depth: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export const createVariant = protectedProcedure
  .input(createVariantSchema)
  .mutation(async ({ ctx, input }) => {
    const { productId, ...variantData } = input;

    // Проверяем существование продукта
    const product = await ctx.db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const [variant] = await ctx.db
      .insert(productVariants)
      .values({
        name: input.name || `${product.name}-variant`,
        productId: input.productId,
        sku: input.sku,
        barcode: input.barcode,
        price: input.price.toString(),
        salePrice: input.salePrice?.toString(),
        costPrice: input.costPrice?.toString(),
        stock: input.stock,
        minStock: input.minStock,
        weight: input.weight?.toString(),
        width: input.width?.toString(),
        height: input.height?.toString(),
        depth: input.depth?.toString(),
        isActive: input.isActive,
        isDefault: input.isDefault,
      })
      .returning();

    return variant;
  });
