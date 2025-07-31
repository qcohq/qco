import type { BrandFileInput } from "@qco/validators";
import { TRPCError } from "@trpc/server";

import { brands, brandFiles, brandCategories } from "@qco/db/schema";
import { createBrandSchema, createBrandResponseSchema } from "@qco/validators";
import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";
import { protectedProcedure } from "../../trpc";

export const create = protectedProcedure
  .input(createBrandSchema)
  .output(createBrandResponseSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { files: inputFiles, categoryIds, ...brandData } = input;
      const [createdBrand] = await ctx.db
        .insert(brands)
        .values({
          name: brandData.name,
          slug: brandData.slug,
          description: brandData.description ?? "",
          shortDescription: brandData.shortDescription ?? "",
          website: brandData.website ?? "",
          email: brandData.email ?? "",
          phone: brandData.phone ?? "",
          isActive: brandData.isActive ?? true,
          isFeatured: brandData.isFeatured ?? false,
          foundedYear: brandData.foundedYear ?? "",
          countryOfOrigin: brandData.countryOfOrigin ?? "",
          brandColor: brandData.brandColor ?? "#000000",
          metaTitle: brandData.metaTitle ?? "",
          metaDescription: brandData.metaDescription ?? "",
          metaKeywords: brandData.metaKeywords ?? [],
          createdBy: ctx.session?.user?.id || "system",
          updatedBy: ctx.session?.user?.id || "system",
        })
        .returning();
      if (!createdBrand) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать бренд",
        });
      }

      // Создаем связи с категориями первого уровня
      if (categoryIds && categoryIds.length > 0) {
        const brandCategoriesData = categoryIds.map((categoryId) => ({
          brandId: createdBrand.id,
          categoryId,
        }));
        await ctx.db.insert(brandCategories).values(brandCategoriesData);
      }

      if (inputFiles && inputFiles.length > 0) {
        const resolvedFiles = await Promise.all(
          inputFiles.map(
            async (
              file: BrandFileInput & {
                meta?: { name?: string; mimeType?: string; size?: number };
              },
              index: number,
            ) => ({
              brandId: createdBrand.id,
              fileId: await resolveFileIdOrPath({
                ctx,
                fileIdOrPath: file.fileId,
                fileType: file.type === "logo" ? "brand_logo" : file.type === "banner" ? "brand_banner" : "brand",
                uploadedBy: ctx.session?.user?.id || "system",
                meta: file.meta,
              }),
              type: file.type,
              order: file.order ?? index + 1,
            }),
          ),
        );
        await ctx.db.insert(brandFiles).values(resolvedFiles);
      }

      // Возвращаем только необходимые данные для фронтенда
      return {
        id: createdBrand.id,
        name: createdBrand.name,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Ошибка при создании бренда",
      });
    }
  });
