import { desc, eq, isNull } from '@qco/db'
import { categories } from '@qco/db/schema'
import { publicProcedure } from '../../trpc'

export const getMenu = publicProcedure
    .query(async ({ ctx }) => {
        // Получаем основные категории (без родителя)
        const mainCategories = await ctx.db.query.categories.findMany({
            where: isNull(categories.parentId),
            orderBy: [desc(categories.sortOrder), desc(categories.createdAt)],
        })

        // Получаем подкатегории для каждой основной категории
        const menuData = await Promise.all(
            mainCategories.map(async (category) => {
                const subcategories = await ctx.db.query.categories.findMany({
                    where: eq(categories.parentId, category.id),
                    orderBy: [desc(categories.sortOrder), desc(categories.createdAt)],
                })

                return {
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    href: `/catalog/${category.slug}`,
                    hasDropdown: subcategories.length > 0,
                    subcategories: subcategories.map((sub: any) => ({
                        id: sub.id,
                        name: sub.name,
                        slug: sub.slug,
                        href: `/catalog/${category.slug}/${sub.slug}`,
                    })),
                }
            })
        )

        return menuData
    }) 
