import { eq } from "drizzle-orm";

import { categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { updateCategoryOrderSchema } from "@qco/validators";

export const updateCategoryOrder = protectedProcedure
    .input(updateCategoryOrderSchema)
    .mutation(async ({ ctx, input }) => {
        const { categoryId, newOrder } = input;
        const [category] = await ctx.db.update(categories).set({ sortOrder: newOrder }).where(eq(categories.id, categoryId)).returning();
        return category;
    }); 
