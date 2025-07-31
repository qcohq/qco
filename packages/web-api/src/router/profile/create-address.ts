import { eq } from '@qco/db';
import { customerAddresses } from '@qco/db/schema';
import { createAddressInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const createAddress = protectedProcedure
    .input(createAddressInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Создаем новый адрес
        const [newAddress] = await ctx.db
            .insert(customerAddresses)
            .values({
                customerId: userId,
                type: "shipping", // или другой тип по умолчанию
                firstName: "", // не входит в createAddressInput
                lastName: "", // не входит в createAddressInput
                company: null, // не входит в createAddressInput
                phone: null, // не входит в createAddressInput
                addressLine1: input.addressLine1,
                addressLine2: input.addressLine2,
                city: input.city,
                state: input.state || null,
                postalCode: input.postalCode,
                country: input.country,
                isDefault: input.isPrimary, // маппинг isPrimary -> isDefault
                notes: input.notes,
            })
            .returning();

        if (!newAddress) {
            throw new Error('Не удалось создать адрес');
        }

        return {
            id: newAddress.id,
            addressLine1: newAddress.addressLine1,
            addressLine2: newAddress.addressLine2,
            city: newAddress.city,
            postalCode: newAddress.postalCode,
            country: newAddress.country,
            isPrimary: newAddress.isDefault, // маппинг isDefault -> isPrimary
            notes: newAddress.notes,
            customerGroup: null, // не существует в схеме БД
        };
    }); 
