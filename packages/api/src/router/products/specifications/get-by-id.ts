import { z } from "zod";
import { eq } from "drizzle-orm";
import { productSpecifications } from "@qco/db/schema";
import { protectedProcedure } from "../../../trpc";

export const getById = protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        return ctx.db.query.productSpecifications.findFirst({
            where: eq(productSpecifications.id, input.id),
        });
    }); 