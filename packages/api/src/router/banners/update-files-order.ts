import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";

import { banners, bannerFiles } from "@qco/db/schema";
import { updateBannerFilesOrderSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const updateFilesOrder = protectedProcedure
  .input(updateBannerFilesOrderSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { bannerId, fileOrders } = input;

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

      // Обновляем порядок файлов
      for (const { fileId, order } of fileOrders) {
        await ctx.db
          .update(bannerFiles)
          .set({ order })
          .where(eq(bannerFiles.bannerId, bannerId) && eq(bannerFiles.fileId, fileId));
      }

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
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при обновлении порядка файлов",
      });
    }
  }); 
