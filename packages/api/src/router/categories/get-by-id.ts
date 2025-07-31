import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { categories, categoryProductTypes, files, productTypes } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { getByIdSchema } from "@qco/validators";

// Тип для информации о типе продукта
type ProductTypeInfo = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
};

export const getById = protectedProcedure
    .input(getByIdSchema)
    .query(async ({ ctx, input }) => {
        try {
            // Найти категорию по ID
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.id, input.id),
            });

            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Категория с ID ${input.id} не найдена`,
                });
            }

            // Получаем объект image, если есть
            let image = null;
            if (category.imageId) {
                const { getFileUrl } = await import("@qco/lib");
                const file = await ctx.db.query.files.findFirst({
                    where: eq(files.id, category.imageId),
                });
                if (file?.path) {
                    image = {
                        fileId: file.id,
                        url: getFileUrl(file.path),
                        meta: {
                            name: file.name,
                            mimeType: file.mimeType,
                            size: file.size,
                        },
                    };
                }
            }

            // Получаем все типы продуктов для категории
            const categoryProductTypeLinks = await ctx.db.query.categoryProductTypes.findMany({
                where: eq(categoryProductTypes.categoryId, category.id),
                orderBy: (fields, { asc }) => [asc(fields.sortOrder)]
            });

            // Получаем информацию о типах продуктов
            const productTypeIds = categoryProductTypeLinks.map((cpt) => cpt.productTypeId);
            const productTypesList: ProductTypeInfo[] = [];
            let primaryProductType: ProductTypeInfo | null = null;
            
            if (productTypeIds.length > 0) {
                // Запрашиваем все типы продуктов для этой категории
                for (const productTypeId of productTypeIds) {
                    const productTypeData = await ctx.db.query.productTypes.findFirst({
                        where: eq(productTypes.id, productTypeId),
                    });
                    
                    if (productTypeData) {
                        const productTypeInfo: ProductTypeInfo = {
                            id: productTypeData.id,
                            name: productTypeData.name,
                            slug: productTypeData.slug,
                            description: productTypeData.description,
                        };
                        
                        productTypesList.push(productTypeInfo);
                        
                        // Находим основной тип продукта
                        const isPrimary = categoryProductTypeLinks.find(
                            (cpt) => cpt.productTypeId === productTypeId && cpt.isPrimary
                        );
                        
                        if (isPrimary) {
                            primaryProductType = productTypeInfo;
                        }
                    }
                }
            }

            return { 
                ...category, 
                image,
                productTypeIds: productTypeIds,
                productTypes: productTypesList,
                primaryProductType: primaryProductType
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: `Ошибка получения категории: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
    }); 
