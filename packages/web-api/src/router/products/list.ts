import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { db } from "@qco/db/client";
import { getFileUrl } from "@qco/lib";
import { eq, and, inArray, ilike, isNull } from "@qco/db";
import { products, productCategories } from "@qco/db/schema";

export interface ListProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  brand: string;
  inStock: boolean;
  createdAt: Date;
}

export const listProducts = publicProcedure
  .input(
    z.object({
      category: z.string().optional(),
      brandId: z.string().optional(),
      search: z.string().optional(),
      page: z.number().optional().default(1),
      limit: z.number().optional().default(20),
    }),
  )
  .query(async ({ input }) => {
    const { category, brandId, search, page = 1, limit = 20 } = input;
    const offset = (page - 1) * limit;
    let productIdsByCategory: string[] | undefined;
    if (category && category !== "all") {
      const catProducts = await db.query.productCategories.findMany({
        where: (pc: any, { eq }: any) => eq(pc.categoryId, category),
      });
      productIdsByCategory = catProducts.map((pc: any) => pc.productId);
      if (productIdsByCategory && productIdsByCategory.length === 0) {
        return { items: [], meta: { total: 0, page, limit } };
      }
    }

    // Compose where conditions for Drizzle
    const whereConditions = [
      eq(products.isActive, true),
    ];

    if (productIdsByCategory) {
      whereConditions.push(inArray(products.id, productIdsByCategory));
    }
    if (brandId) {
      whereConditions.push(eq(products.brandId, brandId));
    }
    if (search) {
      whereConditions.push(ilike(products.name, `%${search}%`));
    }

    const productsData = await db.query.products.findMany({
      where: and(...whereConditions),
      offset,
      limit,
      orderBy: (p: any, { desc }: any) => [desc(p.createdAt)],
      with: {
        brand: true,
        files: true,
        categories: true,
      },
    });

    const total = await db.query.products.findMany({
      where: and(...whereConditions)
    });

    const items: ListProduct[] = productsData.map((product: any) => {
      const productFiles = product.files ?? [];
      const mainImageFile = productFiles.find((f: any) => f.type === "main");
      const mainImage = mainImageFile?.fileId
        ? getFileUrl(mainImageFile.fileId)
        : productFiles[0]?.fileId
          ? getFileUrl(productFiles[0].fileId)
          : "";
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        image: mainImage,
        brand: product.brand?.name ?? "",
        inStock: typeof product.stock === "number" ? product.stock > 0 : true,
        createdAt: product.createdAt,
      };
    });
    return {
      items,
      meta: { total: total.length, page, limit },
    };
  });
