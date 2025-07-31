import { getAccountSettingsInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';

export const getAccountSettings = protectedProcedure
    .input(getAccountSettingsInput)
    .query(async ({ ctx, input }) => {
        // Заглушка - в будущем будет интеграция с настройками аккаунта
        return {
            language: 'ru' as const,
            currency: 'RUB' as const,
            timezone: 'Europe/Moscow',
            privacyLevel: 'private' as const,
            twoFactorEnabled: false,
        };
    }); 
