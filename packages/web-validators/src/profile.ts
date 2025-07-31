import { z } from 'zod/v4';

// Схема для профиля пользователя
export const userProfileSchema = z.object({
    id: z.string(),
    customerCode: z.string(),
    name: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().email(),
    emailVerified: z.boolean(),
    phone: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    gender: z.string().nullable(),
    image: z.string().nullable(),
    isGuest: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Тип для профиля пользователя
export type UserProfile = z.infer<typeof userProfileSchema>;

// Схема для получения профиля пользователя
export const getProfileInput = z.object({
    userId: z.string().optional(),
});

// Схема для обновления профиля
export const updateProfileInput = z.object({
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(100, 'Имя слишком длинное').optional(),
    firstName: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(100, 'Имя слишком длинное').optional(),
    lastName: z.string().min(2, 'Фамилия должна содержать минимум 2 символа').max(100, 'Фамилия слишком длинная').optional(),
    phone: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, { error: 'Неверный формат номера телефона' })
        .optional(),
    dateOfBirth: z.date().optional().refine((val) => !val || val <= new Date(), {
        error: 'Дата рождения не может быть в будущем',
    }),
    gender: z.enum(['male', 'female', 'other']).optional(),
});

// Схема для получения статистики аккаунта
export const getAccountStatsInput = z.object({
    period: z.enum(['week', 'month', 'year']).default('year'),
});

// Схема для получения истории заказов
export const getOrdersHistoryInput = z.object({
    status: z.enum(['all', 'processing', 'shipped', 'delivered', 'cancelled']).default('all'),
    limit: z.number().min(1).max(50).default(10),
    offset: z.number().min(0).default(0),
});

// Схема для получения заказа по ID
export const getOrderByIdInput = z.object({
    orderId: z.string(),
});

// Схема для получения адресов пользователя
export const getAddressesInput = z.object({
    userId: z.string().optional(),
});

// Схема для создания адреса
export const createAddressInput = z.object({
    addressLine1: z.string().min(1, 'Адрес обязателен для заполнения'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'Город обязателен для заполнения'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Почтовый индекс обязателен'),
    country: z.string().min(1, 'Страна обязательна для заполнения'),
    isPrimary: z.boolean().default(false),
    notes: z.string().optional(),
});

// Схема для обновления адреса
export const updateAddressInput = z.object({
    id: z.string(),
    addressLine1: z.string().min(1, 'Адрес обязателен для заполнения'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'Город обязателен для заполнения'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Почтовый индекс обязателен'),
    country: z.string().min(1, 'Страна обязательна для заполнения'),
    isPrimary: z.boolean().default(false),
    notes: z.string().optional(),
});

// Схема для удаления адреса
export const deleteAddressInput = z.object({
    addressId: z.string(),
});

// Схема для получения избранных товаров
export const getFavoritesInput = z.object({
    limit: z.number().min(1).max(50).default(10),
    offset: z.number().min(0).default(0),
});

// Схема для добавления товара в избранное
export const addToFavoritesInput = z.object({
    productId: z.string(),
});

// Схема для удаления товара из избранного
export const removeFromFavoritesInput = z.object({
    productId: z.string(),
});

// Схема для получения настроек уведомлений
export const getNotificationSettingsInput = z.object({
    userId: z.string().optional(),
});

// Схема для обновления настроек уведомлений
export const updateNotificationSettingsInput = z.object({
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    orderUpdates: z.boolean().default(true),
    promotions: z.boolean().default(true),
    newsletter: z.boolean().default(false),
    marketing: z.boolean().default(false),
});

// Схема для получения настроек аккаунта
export const getAccountSettingsInput = z.object({
    userId: z.string().optional(),
});

// Схема для обновления настроек аккаунта
export const updateAccountSettingsInput = z.object({
    language: z.enum(['ru', 'en']).default('ru'),
    currency: z.enum(['RUB', 'USD', 'EUR']).default('RUB'),
    timezone: z.string().default('Europe/Moscow'),
    privacyLevel: z.enum(['public', 'private', 'friends']).default('private'),
    twoFactorEnabled: z.boolean().default(false),
}); 
