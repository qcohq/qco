import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { getProductTypeAttributeByIdSchema } from "@qco/validators";
import { productTypeAttributes } from "@qco/db/schema";
import { eq } from "@qco/db";

export const getById = protectedProcedure
    .input(getProductTypeAttributeByIdSchema)
    .query(async ({ ctx, input }) => {
        const { id } = input;

        const attribute = await ctx.db.query.productTypeAttributes.findFirst({
            where: eq(productTypeAttributes.id, id),
        });

        if (!attribute) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Атрибут не найден",
            });
        }

        return attribute;
    }); 