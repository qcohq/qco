import { eq, count } from "drizzle-orm";
import { categories, productCategories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const recalculateCounts = protectedProcedure.mutation(async ({ ctx }) => {
    // Получаем все категории
    const allCategories = await ctx.db.query.categories.findMany();

    for (const category of allCategories) {
        // Считаем количество продуктов в категории
        const result = await ctx.db
            .select({ count: count() })
            .from(productCategories)
            .where(eq(productCategories.categoryId, category.id));

        const productsCount = result[0]?.count || 0;

        // Обновляем поле в категории
        await ctx.db.update(categories)
            .set({ productsCount })
            .where(eq(categories.id, category.id));
    }

    return { success: true };
}); 
