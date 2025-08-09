import { eq, isNull, and, asc } from '@qco/db'
import { categories } from '@qco/db/schema'
import { publicProcedure } from '../../trpc'
import { categoryListInputV2 } from '@qco/web-validators'

export const list = publicProcedure
    .input(categoryListInputV2)
    .query(async ({ ctx, input }) => {
        const categoriesQuery = ctx.db.query.categories.findMany({
            where: input.parentId
                ? and(
                    eq(categories.parentId, input.parentId),
                    eq(categories.isActive, true)
                )
                : and(
                    isNull(categories.parentId),
                    eq(categories.isActive, true)
                ),
            orderBy: [asc(categories.sortOrder), asc(categories.name)],
            with: {
                image: true,
            },
        })

        const categoriesData = await categoriesQuery

        return categoriesData.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.image ? category.image.path : null,
            isActive: category.isActive,
            sortOrder: category.sortOrder,
            parentId: category.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }))
    }) 
