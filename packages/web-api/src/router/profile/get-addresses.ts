import { asc, eq } from '@qco/db';
import { customerAddresses } from '@qco/db/schema';
import { getAddressesInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';
import { safeMap } from '../../lib/safe-array';

export const getAddresses = protectedProcedure
    .input(getAddressesInput)
    .query(async ({ ctx, input }) => {
        const userId = input.userId || ctx.session.user.id;

        try {
            const addresses = await ctx.db.query.customerAddresses.findMany({
                where: eq(customerAddresses.customerId, userId),
            });
            return safeMap(addresses, (address) => ({
                id: address.id,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                isPrimary: address.isDefault, // маппинг isDefault -> isPrimary
                notes: address.notes,
                customerGroup: null, // не существует в схеме БД
            }));

        } catch (error) {

            return [];
        }

    }); 
