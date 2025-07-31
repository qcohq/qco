import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { SQL } from "drizzle-orm";

import { files, products, productFiles } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";

import { protectedProcedure } from "../../trpc";

export const deleteImage = protectedProcedure
  .input(
    z.object({
      productId: z.string(),
      fileId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование продукта
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Товар с ID ${input.productId} не найден`,
        });
      }
      // Проверяем, есть ли файл у продукта
      const productFile = await ctx.db.query.productFiles.findFirst({
        where: and(
          eq(productFiles.productId, input.productId),
          eq(productFiles.fileId, input.fileId),
        ),
        with: { file: true },
      });
      if (!productFile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Файл с ID ${input.fileId} не найден у продукта`,
        });
      }
      // Удаляем связь ProductFile
      await ctx.db
        .delete(productFiles)
        .where(
          and(
            eq(productFiles.productId, input.productId),
            eq(productFiles.fileId, input.fileId),
          ),
        );
      // Проверяем, используется ли файл ещё где-то
      const fileUsageCount = await ctx.db.query.productFiles.findMany({
        where: eq(productFiles.fileId, input.fileId),
      });
      if (
        fileUsageCount.length === 0 &&
        productFile.file &&
        productFile.file.path
      ) {
        // Импортируем deleteFile только если требуется
        const { deleteFile } = await import("@qco/lib");
        try {
          await deleteFile(productFile.file.path);
        } catch (e) {
          // Не прерываем процесс, если файл не найден в S3

        }
        // Удаляем сам файл из таблицы File
        await ctx.db.delete(files).where(eq(files.id, input.fileId));
      }
      // Возвращаем обновлённый список файлов продукта
      const filesList = await ctx.db.query.productFiles.findMany({
        where: eq(productFiles.productId, input.productId),
        orderBy: (fields, { asc }) => [asc(fields.order)],
        with: { file: true },
      });
      // Формируем ответ с url
      const filesWithMeta = await Promise.all(
        filesList.map(
          (
            pf: typeof productFiles.$inferSelect & {
              file: any;
            },
          ) => {
            let url: string | null = null;
            if (pf.file?.path) {
              url = getFileUrl(pf.file.path);
            }
            return {
              ...pf,
              meta: {
                url,
                size: (pf.file?.size) || null,
                name: (pf.file?.name) || null,
                mimeType: (pf.file?.mimeType) || null,
              },
            };
          },
        ),
      );
      return filesWithMeta;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Ошибка удаления изображения: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
