import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { createProductTypeAttributeSchema } from "@qco/validators";
import { productTypeAttributes, productTypes } from "@qco/db/schema";
import { eq, and } from "@qco/db";

export const create = protectedProcedure
    .input(createProductTypeAttributeSchema)
    .mutation(async ({ ctx, input }) => {
        const {
            productTypeId,
            name,
            slug,
            type,
            options,
            isFilterable,
            isRequired,
            sortOrder,
            isActive,
        } = input;

        // Проверяем, что тип продукта существует
        const productType = await ctx.db.query.productTypes.findFirst({
            where: eq(productTypes.id, productTypeId),
        });

        if (!productType) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Тип продукта не найден",
            });
        }

        // Проверяем уникальность slug для данного типа продукта
        const existingAttribute = await ctx.db.query.productTypeAttributes.findFirst({
            where: and(
                eq(productTypeAttributes.slug, slug),
                eq(productTypeAttributes.productTypeId, productTypeId)
            ),
        });

        if (existingAttribute) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Атрибут с таким slug уже существует",
            });
        }

        // Создаем атрибут
        const [newAttribute] = await ctx.db
            .insert(productTypeAttributes)
            .values({
                productTypeId,
                name,
                slug,
                type,
                options: options || [],
                isFilterable: isFilterable || false,
                isRequired: isRequired || false,
                sortOrder: sortOrder || 0,
                isActive: isActive ?? true,
            })
            .returning();

        return newAttribute;
    });