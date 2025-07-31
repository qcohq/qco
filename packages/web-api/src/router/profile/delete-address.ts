import { eq } from '@qco/db';
import { customerAddresses } from '@qco/db/schema';
import { deleteAddressInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const deleteAddress = protectedProcedure
    .input(deleteAddressInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Проверяем, что адрес принадлежит пользователю
        const existingAddress = await ctx.db.query.customerAddresses.findFirst({
            where: eq(customerAddresses.id, input.addressId),
        });

        if (!existingAddress || existingAddress.customerId !== userId) {
            throw new Error('Адрес не найден или у вас нет прав для его удаления');
        }

        // Удаляем адрес
        await ctx.db
            .delete(customerAddresses)
            .where(eq(customerAddresses.id, input.addressId));

        return { success: true };
    }); 
