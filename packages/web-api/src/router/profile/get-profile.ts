import { eq } from '@qco/db';
import { customers } from '@qco/db/schema';
import { getProfileInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const getProfile = protectedProcedure
    .input(getProfileInput)
    .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.session.user.id;
        console.log(userId)
        const user = await ctx.db.query.customers.findFirst({
            where: eq(customers.id, userId),
            columns: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        // Разбиваем имя на firstName и lastName
        const name = user.name || "";
        const [firstName = "", lastName = ""] = name.split(" ");

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            phone: user.phone,
            firstName,
            lastName,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }); 
