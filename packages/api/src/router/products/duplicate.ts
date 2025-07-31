import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { products } from "@qco/db/schema";

const duplicateProductSchema = z.object({
    id: z.string(),
});

export const duplicate = protectedProcedure
    .input(duplicateProductSchema)
    .mutation(async ({ ctx, input }) => {
        const { id } = input;

        // Получаем оригинальный продукт
        const originalProduct = await ctx.db.query.products.findFirst({
            where: eq(products.id, id),
        });

        if (!originalProduct) {
            throw new Error("Product not found");
        }

        // Создаем копию продукта
        const [duplicatedProduct] = await ctx.db
            .insert(products)
            .values({
                name: `${originalProduct.name} (Copy)`,
                slug: `${originalProduct.slug}-copy`,
                description: originalProduct.description,
                isActive: false,
                isFeatured: originalProduct.isFeatured,
                isPopular: originalProduct.isPopular,
                isNew: originalProduct.isNew,
                stock: originalProduct.stock,
                sku: originalProduct.sku ? `${originalProduct.sku}-copy` : undefined,
                basePrice: originalProduct.basePrice,
                salePrice: originalProduct.salePrice,
                discountPercent: originalProduct.discountPercent,
                hasVariants: originalProduct.hasVariants,
                productTypeId: originalProduct.productTypeId,
                brandId: originalProduct.brandId,
                seoTitle: originalProduct.seoTitle,
                seoUrl: originalProduct.seoUrl,
                seoDescription: originalProduct.seoDescription,
                seoKeywords: originalProduct.seoKeywords,
                xmlId: originalProduct.xmlId ? `${originalProduct.xmlId}-copy` : undefined,
            })
            .returning();

        return duplicatedProduct;
    }); 
