import { eq, inArray } from '@qco/db'
import { categories } from '@qco/db/schema'
import { publicProcedure } from '../../trpc'
import { z } from 'zod'

const getCategoryIdsInput = z.object({
    slugs: z.array(z.string())
})

export const getCategoryIds = publicProcedure
    .input(getCategoryIdsInput)
    .query(async ({ ctx, input }) => {
        const categoriesData = await ctx.db.query.categories.findMany({
            where: inArray(categories.slug, input.slugs),
            columns: {
                id: true,
                slug: true,
            },
        })

        return categoriesData.reduce((acc: Record<string, string>, category: any) => {
            acc[category.slug] = category.id
            return acc
        }, {} as Record<string, string>)
    }) 
