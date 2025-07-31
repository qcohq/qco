import type { brandFiles, files } from "@qco/db/schema";
import { brands } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq, desc } from "@qco/db";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import type { BrandWithFiles } from "@qco/web-validators";

export const getFeaturedBrands = publicProcedure
  .input(z.object({ limit: z.number().min(1).max(50).default(12) }).optional())
  .query(async ({ ctx, input }) => {
    const limit = input?.limit ?? 12;

    const brandsData = await ctx.db.query.brands.findMany({
      where: eq(brands.isFeatured, true),
      orderBy: [desc(brands.isFeatured), brands.name],
      with: {
        files: {
          with: {
            file: true,
          },
        },
      },
      limit,
    });

    // Формируем список избранных брендов с логотипом
    return brandsData.map((brand: BrandWithFiles) => {
      const logoFile = brand.files?.find((f) => f.type === "logo");
      return {
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
        metaTitle: brand.metaTitle,
        metaDescription: brand.metaDescription,
        metaKeywords: brand.metaKeywords,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        createdBy: brand.createdBy,
        updatedBy: brand.updatedBy,
        logo: logoFile?.file?.path ? getFileUrl(logoFile.file.path) : null,
      };
    });
  }); 
