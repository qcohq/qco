import { eq } from "@qco/db";
import { deliverySettings } from "@qco/db/schema";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const getById = protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
        const setting = await ctx.db
            .select()
            .from(deliverySettings)
            .where(eq(deliverySettings.id, input.id))
            .limit(1);

        return setting[0];
    }); 
