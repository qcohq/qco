import { TRPCError } from "@trpc/server";
import { eq, inArray } from "@qco/db";

import { banners, bannerFiles, files } from "@qco/db/schema";
import { bulkDeleteBannersSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const bulkDeleteBanners = protectedProcedure
  .input(bulkDeleteBannersSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { ids } = input;

      // Получаем все баннеры для проверки существования
      const bannersList = await ctx.db.query.banners.findMany({
        where: inArray(banners.id, ids),
      });

      if (bannersList.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Баннеры не найдены",
        });
      }

      // Получаем все файлы баннеров
      const bannerFilesList = await ctx.db.query.bannerFiles.findMany({
        where: inArray(bannerFiles.bannerId, ids),
      });

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

      // Удаляем записи о файлах баннеров
      if (bannerFilesList.length > 0) {
        await ctx.db.delete(bannerFiles).where(inArray(bannerFiles.bannerId, ids));
      }

      // Удаляем записи о файлах
      if (fileIds.length > 0) {
        await ctx.db.delete(files).where(inArray(files.id, fileIds));
      }

      // Удаляем баннеры
      await ctx.db.delete(banners).where(inArray(banners.id, ids));

      return {
        success: true,
        message: `Успешно удалено ${bannersList.length} баннеров`,
        deletedCount: bannersList.length,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при массовом удалении баннеров",
      });
    }
  }); 
