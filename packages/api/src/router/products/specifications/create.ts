import { createProductSpecificationSchema } from "@qco/validators";
import { productSpecifications } from "@qco/db/schema";
import { protectedProcedure } from "../../../trpc";

export const create = protectedProcedure
    .input(createProductSpecificationSchema)
    .mutation(async ({ ctx, input }) => {
        // Удаляем unit, если вдруг пришло с фронта
        const { unit, ...rest } = input as any;
        const [specification] = await ctx.db.insert(productSpecifications).values(rest).returning();
        return specification;
    }); 