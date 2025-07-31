import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";

import { categories, files, productCategories } from "@qco/db/schema";
import { deleteFile } from "@qco/lib";
import { protectedProcedure } from "../../trpc";
import { deleteCategorySchema } from "@qco/validators";

export const deleteItem = protectedProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input, ctx }) => {
        try {
            // Найти категорию
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.id, input.id),
            });
            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Категория с ID ${input.id} не найдена`,
                });
            }

            // Проверяем, есть ли дочерние категории
            const childCategories = await ctx.db.query.categories.findMany({
                where: eq(categories.parentId, input.id),
            });

            if (childCategories.length > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Нельзя удалить категорию, у которой есть дочерние категории. Сначала удалите или переместите дочерние категории.",
                });
            }

            // Проверяем, есть ли связанные товары
            const relatedProducts = await ctx.db.query.productCategories.findMany({
                where: eq(productCategories.categoryId, input.id),
            });

            if (relatedProducts.length > 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Нельзя удалить категорию, к которой привязаны товары. Сначала удалите или переместите товары в другие категории.",
                });
            }

            // Найти связанные файлы (например, imageFileId)
            let filesList: (typeof files.$inferSelect)[] = [];
            if (category.imageId) {
                filesList = await ctx.db.query.files.findMany({
                    where: eq(files.id, category.imageId),
                });
            }

            // Удаляем категорию в транзакции
            await ctx.db.transaction(async (tx) => {
                // Сначала удаляем категорию
                await tx.delete(categories).where(eq(categories.id, input.id));

                // Теперь удаляем файлы из S3 и из базы данных
                if (filesList.length > 0) {
                    for (const file of filesList) {
                        if (file.path) {
                            try {
                                await deleteFile(file.path);
                            } catch (e) {
                                console.warn(`Не удалось удалить файл из S3: ${file.path}`, e);
                            }
                        }
                    }
                    const fileIds = filesList.map((f) => f.id);
                    await tx.delete(files).where(inArray(files.id, fileIds));
                }
            });

            return { success: true };
        } catch (error) {
            console.error("Ошибка при удалении категории:", error);

            // Если это уже TRPCError, пробрасываем его
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : "Ошибка удаления категории",
            });
        }
    }); 
