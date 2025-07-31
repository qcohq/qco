import { eq } from "@qco/db";
import { brands, brandCategories, brandFiles } from "@qco/db/schema";
import { updateBrandSchema, updateBrandResponseSchema } from "@qco/validators";
import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";
import { protectedProcedure } from "../../trpc";

export const updateBrand = protectedProcedure
  .input(updateBrandSchema)
  .output(updateBrandResponseSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, categoryIds, files: inputFiles, ...updateData } = input;

    // Обновляем бренд
    const [brand] = await ctx.db.update(brands).set(updateData).where(eq(brands.id, id)).returning();
    if (!brand) {
      throw new Error("Brand not found");
    }

    // Обновляем категории бренда
    if (categoryIds !== undefined) {
      await ctx.db.delete(brandCategories).where(eq(brandCategories.brandId, id));
      if (categoryIds.length > 0) {
        await ctx.db.insert(brandCategories).values(categoryIds.map(categoryId => ({ brandId: id, categoryId })));
      }
    }

    // Обновляем файлы бренда
    if (inputFiles !== undefined) {
      // Удаляем старые файлы
      await ctx.db.delete(brandFiles).where(eq(brandFiles.brandId, id));

      // Добавляем новые файлы
      if (inputFiles.length > 0) {
        const resolvedFiles = await Promise.all(
          inputFiles.map(
            async (
              file: any,
              index: number,
            ) => ({
              brandId: id,
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
    }

    // Возвращаем только необходимые данные для фронтенда
    return {
      id: brand.id,
      name: brand.name,
    };
  });
