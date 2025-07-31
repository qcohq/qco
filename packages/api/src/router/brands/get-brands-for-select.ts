import { eq, ilike, and } from "drizzle-orm";
import { z } from "zod";

import { brands } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getBrandsForSelect = protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
      limit: z.number().default(20),
      defaultBrandId: z.string().optional(),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { search, limit, defaultBrandId } = input;
    const whereConditions = [];
    if (search) {
      whereConditions.push(ilike(brands.name, `%${search}%`));
    }
    if (defaultBrandId) {
      whereConditions.push(eq(brands.id, defaultBrandId));
    }
    const brandsList = await ctx.db.query.brands.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: (brands, { asc }) => [asc(brands.name)],
      limit,
    });
    return {
      data: brandsList.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        shortDescription: brand.shortDescription,
        website: brand.website,
        email: brand.email,
        phone: brand.phone,
        isActive: brand.isActive,
        isFeatured: brand.isFeatured,
        foundedYear: brand.foundedYear,
        countryOfOrigin: brand.countryOfOrigin,
        brandColor: brand.brandColor,
      })),
      pagination: {
        hasMore: false,
        total: brandsList.length,
      },
    };
  });
