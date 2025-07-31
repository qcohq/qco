import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { productAttributeValues } from "@qco/db/schema";
import { eq } from "@qco/db";
import { getProductAttributeValuesByProductIdSchema } from "@qco/validators";

export const getByProductId = protectedProcedure
    .input(getProductAttributeValuesByProductIdSchema)
    .query(async ({ ctx, input }) => {
        const { productId } = input;

        try {
            const attributeValues = await ctx.db.query.productAttributeValues.findMany({
                where: eq(productAttributeValues.productId, productId),
                with: {
                    attribute: true,
                },
                orderBy: (productAttributeValues, { asc }) => [asc(productAttributeValues.createdAt)],
            });

            return attributeValues;
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось получить значения атрибутов продукта",
                cause: error,
            });
        }
    }); 