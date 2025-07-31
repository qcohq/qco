import { eq } from "@qco/db";
import { deliverySettings } from "@qco/db/schema";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const deleteDeliverySettings = protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const [setting] = await ctx.db
            .delete(deliverySettings)
            .where(eq(deliverySettings.id, input.id))
            .returning();

        return setting;
    }); 
