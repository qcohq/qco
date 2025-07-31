import { z } from "zod";
import { eq } from "drizzle-orm";
import { productSpecifications } from "@qco/db/schema";
import { protectedProcedure } from "../../../trpc";

export const list = protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
        return ctx.db.query.productSpecifications.findMany({
            where: eq(productSpecifications.productId, input.productId),
            orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
        });
    }); 