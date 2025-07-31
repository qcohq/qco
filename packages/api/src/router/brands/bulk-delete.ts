import { TRPCError } from "@trpc/server";
import { eq as eqFn, inArray } from "drizzle-orm";
import { z } from "zod";

import { brands, brandFiles, files as filesTable, brandCategories, categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const bulkDeleteBrands = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
        try {
            const { ids } = input;

            if (ids.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Необходимо указать хотя бы один ID бренда для удаления",
                });
            }

            // Получаем бренды для проверки существования
            const brandsList = await ctx.db.query.brands.findMany({
                where: inArray(brands.id, ids),
            });

            if (brandsList.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Не найдено брендов для удаления",
                });
            }

            if (brandsList.length !== ids.length) {
                const foundIds = brandsList.map((brand: typeof brands.$inferSelect) => brand.id);
                const notFoundIds = ids.filter((id) => !foundIds.includes(id));
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Следующие бренды не найдены: ${notFoundIds.join(", ")}`,
                });
            }

            // Получаем все файлы брендов
            const brandFilesList = await ctx.db.query.brandFiles.findMany({
                where: inArray(brandFiles.brandId, ids),
            });

            // Получаем информацию о файлах для удаления из S3
            const fileIds = brandFilesList.map(
                (bf: typeof brandFiles.$inferSelect) => bf.fileId,
            );

            let files: { id: string; path: string }[] = [];
            if (fileIds.length > 0) {
                files = await ctx.db.query.files.findMany({
                    where: inArray(filesTable.id, fileIds),
                });
            }

            // Удаляем файлы из S3
            const { deleteFile } = await import("@qco/lib");
            for (const file of files) {
                if (file.path) {
                    try {
                        await deleteFile(file.path);
                    } catch (error) {
                        console.error(`Ошибка при удалении файла ${file.path}:`, error);
                    }
                }
            }

            // Удаляем записи о файлах брендов
            if (brandFilesList.length > 0) {
                await ctx.db.delete(brandFiles).where(inArray(brandFiles.brandId, ids));
            }

            // Удаляем записи о файлах
            const fileIdsToDelete = files.map((file: { id: string; path: string }) => file.id);
            if (fileIdsToDelete.length > 0) {
                await ctx.db.delete(filesTable).where(inArray(filesTable.id, fileIdsToDelete));
            }

            // Удаляем бренды
            await ctx.db.delete(brands).where(inArray(brands.id, ids));

            return {
                success: true,
                message: `Успешно удалено ${brandsList.length} брендов`,
                deletedCount: brandsList.length,
            };
        } catch (error) {
            if (error instanceof TRPCError) throw error;

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : "Ошибка при массовом удалении брендов",
            });
        }
    });
