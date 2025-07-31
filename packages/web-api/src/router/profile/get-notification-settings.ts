import { getNotificationSettingsInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const getNotificationSettings = protectedProcedure
    .input(getNotificationSettingsInput)
    .query(async ({ ctx, input }) => {
        // Заглушка - в будущем будет интеграция с системой уведомлений
        return {
            emailNotifications: true,
            pushNotifications: true,
            orderUpdates: true,
            promotions: true,
            newsletter: false,
            marketing: false,
        };
    }); 
