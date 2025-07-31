import { deliverySettings } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getAll = protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.db
        .select()
        .from(deliverySettings)
        .orderBy(deliverySettings.createdAt);

    return settings;
}); 
