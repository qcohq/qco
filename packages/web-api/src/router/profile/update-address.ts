import { eq } from '@qco/db';
import { customerAddresses } from '@qco/db/schema';
import { updateAddressInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const updateAddress = protectedProcedure
    .input(updateAddressInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Проверяем, что адрес принадлежит пользователю
        const existingAddress = await ctx.db.query.customerAddresses.findFirst({
            where: eq(customerAddresses.id, input.id),
        });

        if (!existingAddress || existingAddress.customerId !== userId) {
            throw new Error('Адрес не найден или у вас нет прав для его изменения');
        }

        // Если адрес должен стать основным, сбрасываем флаг у других адресов
        if (input.isPrimary) {
            await ctx.db
                .update(customerAddresses)
                .set({ isDefault: false })
                .where(eq(customerAddresses.customerId, userId));
        }

        // Обновляем адрес
        const updatedAddress = await ctx.db
            .update(customerAddresses)
            .set({
                addressLine1: input.addressLine1,
                addressLine2: input.addressLine2,
                city: input.city,
                state: input.state || null,
                postalCode: input.postalCode,
                country: input.country,
                isDefault: input.isPrimary, // маппинг isPrimary -> isDefault
                notes: input.notes,
            })
            .where(eq(customerAddresses.id, input.id))
            .returning();

        if (!updatedAddress[0]) {
            throw new Error('Не удалось обновить адрес');
        }

        return updatedAddress[0];
    }); 
