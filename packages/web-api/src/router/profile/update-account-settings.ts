import { updateAccountSettingsInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const updateAccountSettings = protectedProcedure
    .input(updateAccountSettingsInput)
    .mutation(async ({ ctx, input }) => {
        // Заглушка - в будущем будет интеграция с настройками аккаунта
        return input;
    }); 
