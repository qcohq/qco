import { TRPCError } from "@trpc/server";
import { eq, max } from "@qco/db";
import type { SQL } from "drizzle-orm";

import { banners, bannerFiles } from "@qco/db/schema";
import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";
import { addBannerFileSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const addFile = protectedProcedure
  .input(addBannerFileSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { bannerId, file } = input;

      const banner = await ctx.db.query.banners.findFirst({
        where: eq(banners.id, bannerId),
      });

      if (!banner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Баннер с ID ${bannerId} не найден`,
        });
      }

      // Получаем максимальный порядок для данного баннера
      const maxOrderResult = await ctx.db
        .select({
          maxOrder: max(bannerFiles.order).as("maxOrder"),
        })
        .from(bannerFiles)
        .where(eq(bannerFiles.bannerId, bannerId));

      const maxOrder = maxOrderResult[0]?.maxOrder ?? 0;

      // Разрешаем fileId или создаем новый файл
      const resolvedFileId = await resolveFileIdOrPath({
        ctx,
        fileIdOrPath: file.fileId,
        fileType: "banner",
        uploadedBy: ctx.session?.user?.id || "system",
        meta: file.meta,
      });

      // Создаем запись BannerFile
      await ctx.db.insert(bannerFiles).values({
        type: input.file.type,
        bannerId: input.bannerId,
        fileId: resolvedFileId, // Используем разрешенный fileId вместо исходного пути
        order: input.file.order || 0,
      });

      // Получаем обновленный список файлов баннера
      const files = await ctx.db.query.bannerFiles.findMany({
        where: eq(bannerFiles.bannerId, bannerId),
        orderBy: (fields, { asc }) => [asc(fields.order)],
        with: {
          file: true,
        },
      });

      return { ...banner, files };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при добавлении файла",
      });
    }
  }); 
