import { brands } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq } from "@qco/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { brandDetailSchema } from "@qco/web-validators";

const getBrandByIdSchema = z.object({
  id: z.string().min(1, "Brand ID is required"),
});

export const getById = publicProcedure
  .input(getBrandByIdSchema)
  .output(brandDetailSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { id } = input;

      const brand = await ctx.db.query.brands.findFirst({
        where: eq(brands.id, id),
        with: {
          files: {
            with: {
              file: true,
            },
          },
        },
      });

      if (!brand) {
        throw new Error(`Brand with ID "${id}" not found`);
      }

      // Получаем логотип
      const logoFile = brand.files?.find((f) => f.type === "logo");
      const logo = logoFile?.file?.path ? getFileUrl(logoFile.file.path) : null;

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
        logo,
      };
    } catch (error) {
      throw new Error("Failed to fetch brand by ID");
    }
  }); 
