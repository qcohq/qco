import { eq } from "@qco/db";
import { brands } from "@qco/db/schema";
import { getBrandByIdSchema, brandWithRelationsSchema } from "@qco/validators";
import { getFileUrl } from "@qco/lib";
import { protectedProcedure } from "../../trpc";

export const getById = protectedProcedure
  .input(getBrandByIdSchema)
  .output(brandWithRelationsSchema.nullable())
  .query(async ({ ctx, input }) => {
    const { id } = input;

    const brand = await ctx.db.query.brands.findFirst({
      where: eq(brands.id, id),
      with: {
        brandCategories: {
          with: {
            category: true,
          },
        },
        files: {
          with: {
            file: true,
          },
          orderBy: (files, { asc }) => [
            asc(files.type),
            asc(files.order),
          ],
        },
      },
    });

    if (!brand) {
      return null;
    }

    // Форматируем категории
    const categories = brand.brandCategories?.map((bc) => ({
      id: bc.category.id,
      name: bc.category.name,
      slug: bc.category.slug,
      description: bc.category.description,
      parentId: bc.category.parentId,
      isActive: bc.category.isActive,
      sortOrder: bc.category.sortOrder,
      metaTitle: bc.category.metaTitle,
      metaDescription: bc.category.metaDescription,
      xmlId: bc.category.xmlId,
      createdAt: bc.category.createdAt,
      updatedAt: bc.category.updatedAt,
    })) || [];

    // Форматируем файлы
    const files = brand.files?.map((bf) => {
      const url = bf.file?.path ? getFileUrl(bf.file.path) : null;
      return {
        id: bf.id,
        brandId: bf.brandId,
        fileId: bf.fileId,
        type: bf.type,
        order: bf.order,
        createdAt: bf.createdAt,
        file: {
          id: bf.file?.id || "",
          path: bf.file?.path || "",
          name: bf.file?.name || "",
          mimeType: bf.file?.mimeType || "",
          size: bf.file?.size || 0,
        },
        url,
      };
    }) || [];

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
      categories,
      files,
    };
  });
