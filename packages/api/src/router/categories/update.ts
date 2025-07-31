import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { categories, categoryProductTypes, files } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { updateCategorySchema } from "@qco/validators";
import { generateS3Key } from "@qco/lib";

export const updateCategory = protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
        const { id, image, productTypeIds, ...updateData } = input;

        let imageId: string | null = updateData.imageId || null;

        // Если передан новый файл изображения, создаем запись в БД
        if (image) {
            try {
                // Используем fileId из image или генерируем новый ключ
                const s3Key = image.fileId || generateS3Key(image.meta?.name || "category-image", false);

                // Создаем запись о файле в БД
                const [fileRecord] = await ctx.db
                    .insert(files)
                    .values({
                        id: image.fileId,
                        name: image.meta?.name || "category-image",
                        mimeType: image.meta?.mimeType || "image/jpeg",
                        size: image.meta?.size || 0,
                        path: s3Key,
                        type: "category_image",
                        uploadedBy: ctx.session.user.id,
                    })
                    .returning();

                if (!fileRecord) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Не удалось создать запись о файле",
                    });
                }

                imageId = fileRecord.id;
            } catch (error) {
                console.error("Ошибка при создании файла:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Ошибка при обработке изображения",
                });
            }
        }

        // Проверяем, что parentId ссылается на существующую категорию
        if (updateData.parentId !== undefined && updateData.parentId !== null) {
            // Проверяем, что категория не пытается стать родителем самой себя
            if (updateData.parentId === id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Категория не может быть родителем самой себя",
                });
            }

            const parentCategory = await ctx.db
                .select({ id: categories.id })
                .from(categories)
                .where(eq(categories.id, updateData.parentId))
                .limit(1);

            if (parentCategory.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Родительская категория не найдена",
                });
            }
        }

        // Подготавливаем данные для обновления
        const updateFields = {
            ...updateData,
            imageId,
        };

        // Убеждаемся, что parentId корректно обрабатывается
        if (updateData.parentId === "") {
            updateFields.parentId = null;
        }

        // Обновляем категорию
        const [category] = await ctx.db
            .update(categories)
            .set(updateFields)
            .where(eq(categories.id, id))
            .returning();

        if (!category) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Категория не найдена",
            });
        }

        // Обрабатываем связи с типами продуктов
        if (productTypeIds !== undefined) {
            try {
                // Сначала удаляем все существующие связи для этой категории
                await ctx.db
                    .delete(categoryProductTypes)
                    .where(eq(categoryProductTypes.categoryId, id));

                // Если указаны новые типы продуктов, создаем новые связи
                if (productTypeIds && productTypeIds.length > 0) {
                    // Создаем массив связей для вставки
                    const productTypeLinks = productTypeIds.map((productTypeId, index) => ({
                        categoryId: id,
                        productTypeId,
                        isPrimary: index === 0, // Первый тип продукта устанавливаем как основной
                        sortOrder: index
                    }));

                    // Вставляем все связи одним запросом
                    await ctx.db
                        .insert(categoryProductTypes)
                        .values(productTypeLinks);
                }
            } catch (error) {
                console.error("Ошибка при обновлении связей категории с типами продуктов:", error);
                // Не выбрасываем ошибку, чтобы не блокировать обновление категории
            }
        }

        return category;
    }); 
