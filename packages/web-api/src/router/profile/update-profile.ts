import { eq } from '@qco/db';
import { customers } from '@qco/db/schema';
import { updateProfileInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const updateProfile = protectedProcedure
    .input(updateProfileInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const updatedUser = await ctx.db
            .update(customers)
            .set({
                name: `${input.firstName} ${input.lastName}`.trim(),
                phone: input.phone,
                dateOfBirth: input.dateOfBirth,
                gender: input.gender,
                updatedAt: new Date(),
            })
            .where(eq(customers.id, userId))
            .returning();

        if (!updatedUser[0]) {
            throw new Error('Не удалось обновить профиль');
        }

        return updatedUser[0];
    }); 
