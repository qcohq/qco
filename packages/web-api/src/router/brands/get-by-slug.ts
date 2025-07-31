import type { brandFiles, files } from "@qco/db/schema";
import { brands } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq } from "@qco/db";
import { publicProcedure } from "../../trpc";
import {
  getBrandBySlugSchema,
  brandDetailWithFilesSchema
} from "@qco/web-validators";
import type { BrandWithFiles } from "@qco/web-validators";

export const getBySlug = publicProcedure
  .input(getBrandBySlugSchema)
  .output(brandDetailWithFilesSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { slug } = input;

      const brand = await ctx.db.query.brands.findFirst({
        where: eq(brands.slug, slug),
        with: {
          files: {
            with: {
              file: true,
            },
          },
        },
      }) as BrandWithFiles | undefined;

      if (!brand) {
        throw new Error(`Brand with slug "${slug}" not found`);
      }

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
        files: brand.files?.map((file) => ({
          id: file.id,
          brandId: file.brandId,
          fileId: file.fileId,
          type: file.type,
          order: file.order ?? 0,
          createdAt: file.createdAt,
          file: {
            id: file.file?.id,
            path: file.file?.path,
            name: file.file?.name,
            mimeType: file.file?.mimeType,
            size: file.file?.size,
          },
        })),
      };
    } catch (error) {

      throw new Error("Failed to fetch brand by slug");
    }
  }); 
