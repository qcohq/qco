import { updateNotificationSettingsInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const updateNotificationSettings = protectedProcedure
    .input(updateNotificationSettingsInput)
    .mutation(async ({ ctx, input }) => {
        // Заглушка - в будущем будет интеграция с системой уведомлений
        return input;
    }); 
