import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { searchQuerySchema } from "@qco/web-validators";
import { eq, and, or, like, desc, asc, sql, gte, lte, inArray } from "@qco/db";
import { getFileUrl } from "@qco/lib";

export const search = publicProcedure
    .input(searchQuerySchema)
    .query(async ({ input, ctx }) => {
        const { q, category, brand, minPrice, maxPrice, sortBy = "relevance", page = 1, limit = 20 } = input;

        try {
            // Добавляем условия поиска
            const whereConditions = [sql`p.is_active = true`];

            if (q) {
                whereConditions.push(sql`(p.name ILIKE ${`%${q}%`} OR p.description ILIKE ${`%${q}%`})`);
            }

            if (brand) {
                whereConditions.push(sql`b.slug = ${brand}`);
            }

            if (minPrice !== undefined) {
                whereConditions.push(sql`CAST(p.base_price AS DECIMAL) >= ${minPrice}`);
            }

            if (maxPrice !== undefined) {
                whereConditions.push(sql`CAST(p.base_price AS DECIMAL) <= ${maxPrice}`);
            }

            // Получаем общее количество
            const totalQuery = ctx.db
                .select({ count: sql<number>`COUNT(*)` })
                .from(sql`products p`)
                .leftJoin(sql`brands b`, sql`p.brand_id = b.id`)
                .where(sql.join(whereConditions, sql` AND `));

            const totalResult = await totalQuery;
            const total = totalResult[0]?.count || 0;
            const totalPages = Math.ceil(total / limit);
            const offset = (page - 1) * limit;

            // Определяем сортировку
            let orderBy = sql`p.created_at DESC`;
            switch (sortBy) {
                case "price_asc":
                    orderBy = sql`CAST(p.base_price AS DECIMAL) ASC`;
                    break;
                case "price_desc":
                    orderBy = sql`CAST(p.base_price AS DECIMAL) DESC`;
                    break;
                case "newest":
                    orderBy = sql`p.created_at DESC`;
                    break;
                case "popular":
                    orderBy = sql`p.is_popular DESC, p.created_at DESC`;
                    break;
            }

            // Получаем товары с главными изображениями
            const productsQuery = ctx.db
                .select({
                    id: sql<string>`p.id`,
                    name: sql<string>`p.name`,
                    slug: sql<string>`p.slug`,
                    description: sql<string>`p.description`,
                    basePrice: sql<string>`p.base_price`,
                    salePrice: sql<string>`p.sale_price`,
                    discountPercent: sql<number>`p.discount_percent`,
                    isNew: sql<boolean>`p.is_new`,
                    isFeatured: sql<boolean>`p.is_featured`,
                    isPopular: sql<boolean>`p.is_popular`,
                    brandId: sql<string>`p.brand_id`,
                    brandName: sql<string>`b.name`,
                    brandSlug: sql<string>`b.slug`,
                    // Главное изображение
                    mainImagePath: sql<string>`f.path`,
                })
                .from(sql`products p`)
                .leftJoin(sql`brands b`, sql`p.brand_id = b.id`)
                .leftJoin(sql`product_files pf`, sql`p.id = pf.product_id AND pf.type = 'main'`)
                .leftJoin(sql`files f`, sql`pf.file_id = f.id`)
                .where(sql.join(whereConditions, sql` AND `))
                .orderBy(orderBy)
                .limit(limit)
                .offset(offset);

            const productsData = await productsQuery;

            // Форматируем результаты
            const products = productsData.map((row) => {
                const price = row.salePrice || row.basePrice;
                const originalPrice = row.salePrice ? row.basePrice : null;
                const discount = row.discountPercent ||
                    (originalPrice && price ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100) : null);

                // Получаем URL главного изображения
                const image = row.mainImagePath ? getFileUrl(row.mainImagePath) : "/placeholder.svg?height=400&width=300";

                return {
                    id: row.id,
                    name: row.name,
                    slug: row.slug,
                    brand: {
                        id: row.brandId,
                        name: row.brandName || "Unknown",
                        slug: row.brandSlug || "",
                    },
                    price: Number(price) || 0,
                    originalPrice: originalPrice ? Number(originalPrice) : undefined,
                    discount,
                    image,
                    category: {
                        id: "",
                        name: "Category",
                        slug: "",
                    },
                    isNew: row.isNew || false,
                    isSale: !!row.salePrice || !!row.discountPercent,
                };
            });

            return {
                products,
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        } catch (error) {
            console.error("Search error:", error);
            return {
                products: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
        }
    }); 