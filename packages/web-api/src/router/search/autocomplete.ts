import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { sql } from "@qco/db";

export const autocomplete = publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
        const { query } = input;

        try {
            const suggestions = [];

            // Поиск товаров
            const productSuggestions = await ctx.db
                .select({
                    name: sql<string>`p.name`,
                    count: sql<number>`COUNT(*)`,
                })
                .from(sql`products p`)
                .where(sql`p.is_active = true AND p.name ILIKE ${`%${query}%`}`)
                .groupBy(sql`p.name`)
                .limit(3);

            suggestions.push(
                ...productSuggestions.map((product) => ({
                    type: "product" as const,
                    text: product.name,
                    value: product.name,
                    count: Number(product.count),
                }))
            );

            // Поиск брендов
            const brandSuggestions = await ctx.db
                .select({
                    name: sql<string>`b.name`,
                    count: sql<number>`COUNT(*)`,
                })
                .from(sql`brands b`)
                .innerJoin(sql`products p`, sql`b.id = p.brand_id`)
                .where(sql`b.is_active = true AND p.is_active = true AND b.name ILIKE ${`%${query}%`}`)
                .groupBy(sql`b.name`)
                .limit(2);

            suggestions.push(
                ...brandSuggestions.map((brand) => ({
                    type: "brand" as const,
                    text: brand.name,
                    value: brand.name,
                    count: Number(brand.count),
                }))
            );

            return { suggestions };
        } catch (error) {
            console.error("Autocomplete error:", error);
            return { suggestions: [] };
        }
    }); 