import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { brands, brandFiles, files } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

const deleteBrandSchema = z.object({
  id: z.string(),
});

export const deleteBrand = protectedProcedure
  .input(deleteBrandSchema)
  .mutation(async ({ ctx, input }) => {
    const { id } = input;

    // Получаем все файлы, связанные с брендом через brandFiles
    const brandFilesList = await ctx.db.query.brandFiles.findMany({
      where: eq(brandFiles.brandId, id),
    });

    const fileIds = brandFilesList.map(bf => bf.fileId);

    // Удаляем файлы из S3
    if (fileIds.length > 0) {
      const filesList = await ctx.db.query.files.findMany({
        where: inArray(files.id, fileIds),
      });

      const { deleteFile } = await import("@qco/lib");
      for (const file of filesList) {
        if (file.path) {
          try {
            await deleteFile(file.path);
          } catch (error) {
            console.error(`Ошибка при удалении файла ${file.path}:`, error);
          }
        }
      }

      // Удаляем связи бренда с файлами
      await ctx.db.delete(brandFiles).where(eq(brandFiles.brandId, id));

      // Удаляем сами файлы
      await ctx.db.delete(files).where(inArray(files.id, fileIds));
    }

    // Удаляем бренд
    await ctx.db.delete(brands).where(eq(brands.id, id));

    return { success: true };
  });
