import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { categories, categoryProductTypes, files } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { createCategorySchema } from "@qco/validators";
import { generateS3Key } from "@qco/lib";

export const create = protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
        const { image, productTypeIds, ...categoryData } = input;
        let imageId: string | null = null;

        // Если передан файл изображения, создаем запись в БД
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
        if (categoryData.parentId !== undefined && categoryData.parentId !== null) {
            const parentCategory = await ctx.db
                .select({ id: categories.id })
                .from(categories)
                .where(eq(categories.id, categoryData.parentId))
                .limit(1);

            if (parentCategory.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Родительская категория не найдена",
                });
            }
        }

        // Создаем категорию с imageId
        const [category] = await ctx.db
            .insert(categories)
            .values({
                ...categoryData,
                imageId,
                isFeatured: categoryData.isFeatured ?? false,
            })
            .returning();

        if (!category) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось создать категорию",
            });
        }

        // Если указаны типы продуктов, создаем связи в таблице category_product_types
        if (productTypeIds && productTypeIds.length > 0) {
            try {
                // Создаем массив связей для вставки
                const productTypeLinks = productTypeIds.map((productTypeId, index) => ({
                    categoryId: category.id,
                    productTypeId,
                    isPrimary: index === 0, // Первый тип продукта устанавливаем как основной
                    sortOrder: index
                }));

                // Вставляем все связи одним запросом
                await ctx.db
                    .insert(categoryProductTypes)
                    .values(productTypeLinks);
            } catch (error) {
                console.error("Ошибка при создании связей категории с типами продуктов:", error);
                // Не выбрасываем ошибку, чтобы не блокировать создание категории
            }
        }

        return category;
    }); 
