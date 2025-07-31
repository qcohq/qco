import { updateProductSpecificationSchema } from "@qco/validators";
import { productSpecifications } from "@qco/db/schema";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../../trpc";

export const update = protectedProcedure
    .input(updateProductSpecificationSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, unit, ...data } = input as any;
        const [specification] = await ctx.db
            .update(productSpecifications)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(productSpecifications.id, id))
            .returning();
        return specification;
    }); 