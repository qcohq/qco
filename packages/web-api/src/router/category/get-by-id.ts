import { eq } from '@qco/db'
import { categories } from '@qco/db/schema'
import { categoryIdInputV2 } from '@qco/web-validators'
import { publicProcedure } from '../../trpc'

export const getById = publicProcedure
    .input(categoryIdInputV2)
    .query(({ ctx, input }) =>
        ctx.db.query.categories.findFirst({
            where: eq(categories.id, input.id),
        }),
    ) 
