import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";

import { banners, bannerFiles, files } from "@qco/db/schema";
import { removeBannerFileSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const removeFile = protectedProcedure
  .input(removeBannerFileSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { bannerId, fileId } = input;

      // Проверяем существование баннера
      const banner = await ctx.db.query.banners.findFirst({
        where: eq(banners.id, bannerId),
      });

      if (!banner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Баннер с ID ${bannerId} не найден`,
        });
      }

      // Проверяем существование файла баннера
      const bannerFile = await ctx.db.query.bannerFiles.findFirst({
        where: eq(bannerFiles.bannerId, bannerId) && eq(bannerFiles.fileId, fileId),
      });

      if (!bannerFile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Файл с ID ${fileId} не найден в баннере ${bannerId}`,
        });
      }

      // Получаем информацию о файле для удаления из S3
      const file = await ctx.db.query.files.findFirst({
        where: eq(files.id, fileId),
      });

      // Удаляем файл из S3
      if (file?.path) {
        const { deleteFile } = await import("@qco/lib");
        try {
          await deleteFile(file.path);
        } catch (error) {
          console.error(`Ошибка при удалении файла ${file.path}:`, error);
        }
      }

      // Удаляем запись о файле баннера
      await ctx.db.delete(bannerFiles).where(
        eq(bannerFiles.bannerId, bannerId) && eq(bannerFiles.fileId, fileId)
      );

      // Удаляем запись о файле
      if (file) {
        await ctx.db.delete(files).where(eq(files.id, fileId));
      }

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при удалении файла баннера",
      });
    }
  }); 
