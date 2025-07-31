import { publicProcedure } from "../../trpc";
import { sql, desc } from "@qco/db";

export const getPopularSearches = publicProcedure
    .query(async ({ ctx }) => {
        try {
            // Получаем популярные бренды
            const popularBrands = await ctx.db
                .select({
                    name: sql<string>`b.name`,
                    count: sql<number>`COUNT(*)`,
                })
                .from(sql`brands b`)
                .innerJoin(sql`products p`, sql`b.id = p.brand_id`)
                .where(sql`b.is_active = true AND p.is_active = true`)
                .groupBy(sql`b.name`)
                .orderBy(sql`COUNT(*) DESC`)
                .limit(5);

            return popularBrands.map((brand) => ({
                query: brand.name,
                count: Number(brand.count),
            }));
        } catch (error) {
            console.error("Popular searches error:", error);
            return [
                { query: "платье", count: 100 },
                { query: "кроссовки", count: 80 },
                { query: "сумка", count: 60 },
            ];
        }
    }); 