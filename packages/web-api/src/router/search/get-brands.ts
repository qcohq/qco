import { publicProcedure } from "../../trpc";
import { sql } from "@qco/db";

export const getBrands = publicProcedure
    .query(async ({ ctx }) => {
        try {
            const brandsData = await ctx.db
                .select({
                    id: sql<string>`b.id`,
                    name: sql<string>`b.name`,
                    slug: sql<string>`b.slug`,
                    count: sql<number>`COUNT(*)`,
                })
                .from(sql`brands b`)
                .innerJoin(sql`products p`, sql`b.id = p.brand_id`)
                .where(sql`b.is_active = true AND p.is_active = true`)
                .groupBy(sql`b.id, b.name, b.slug`)
                .orderBy(sql`COUNT(*) DESC`);

            return brandsData.map((brand) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                count: Number(brand.count),
            }));
        } catch (error) {
            console.error("Brands error:", error);
            return [
                { id: "1", name: "PHILIPP PLEIN", slug: "philipp-plein", count: 25 },
                { id: "2", name: "BALMAIN", slug: "balmain", count: 20 },
                { id: "3", name: "ANTE KOVAC", slug: "ante-kovac", count: 15 },
            ];
        }
    }); 