import { TRPCError } from "@trpc/server";
import { eq, inArray } from "@qco/db";

import { banners, bannerFiles, files } from "@qco/db/schema";
import { deleteBannerSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const deleteBanner = protectedProcedure
  .input(deleteBannerSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const banner = await ctx.db.query.banners.findFirst({
        where: eq(banners.id, input.id),
      });

      if (!banner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Баннер с ID ${input.id} не найден`,
        });
      }

      const bannerFilesList = await ctx.db.query.bannerFiles.findMany({
        where: eq(bannerFiles.bannerId, input.id),
      });

      // Удаляем записи о файлах баннера
      if (bannerFilesList.length > 0) {
        await ctx.db.delete(bannerFiles).where(eq(bannerFiles.bannerId, input.id));
      }

      // Получаем информацию о файлах для удаления из S3
      const fileIds = bannerFilesList.map((bf: any) => bf.fileId);
      let filesList: { id: string; path: string }[] = [];
      if (fileIds.length > 0) {
        filesList = await ctx.db.query.files.findMany({
          where: inArray(files.id, fileIds),
        });
      }

      // Удаляем файлы из S3
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

      // Удаляем записи о файлах
      if (fileIds.length > 0) {
        await ctx.db.delete(files).where(inArray(files.id, fileIds));
      }

      // Удаляем баннер
      await ctx.db.delete(banners).where(eq(banners.id, input.id));

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при удалении баннера",
      });
    }
  }); 
