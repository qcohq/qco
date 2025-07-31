import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { z } from "zod";

import { productTypeAttributes } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

const getAllAttributesSchema = z.object({
    productTypeId: z.string().optional(),
});

export const getAll = protectedProcedure
    .input(getAllAttributesSchema)
    .query(async ({ ctx, input }) => {
        const { productTypeId } = input;

        const whereConditions = productTypeId ? [eq(productTypeAttributes.productTypeId, productTypeId)] : [];

        const attributes = await ctx.db.query.productTypeAttributes.findMany({
            where: whereConditions.length > 0 ? whereConditions[0] : undefined,
            orderBy: (productTypeAttributes, { asc }) => [asc(productTypeAttributes.name)],
        });

        return attributes;
    }); 