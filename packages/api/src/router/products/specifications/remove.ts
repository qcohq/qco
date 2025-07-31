import { deleteProductSpecificationSchema } from "@qco/validators";
import { productSpecifications } from "@qco/db/schema";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../../trpc";

export const remove = protectedProcedure
    .input(deleteProductSpecificationSchema)
    .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(productSpecifications).where(eq(productSpecifications.id, input.id));
        return { success: true };
    }); 