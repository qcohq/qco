import type { TRPCRouterRecord } from '@trpc/server';
import { getProfile } from './get-profile';
import { updateProfile } from './update-profile';
import { getAccountStats } from './get-account-stats';
import { getProfileStats } from './get-profile-stats';
import { getOrdersHistory } from './get-orders-history';
import { getOrderById } from './get-order-by-id';
import { getAddresses } from './get-addresses';
import { createAddress } from './create-address';
import { updateAddress } from './update-address';
import { deleteAddress } from './delete-address';
import { getFavorites } from './get-favorites';
import { addToFavorites } from './add-to-favorites';
import { removeFromFavorites } from './remove-from-favorites';
import { getNotificationSettings } from './get-notification-settings';
import { updateNotificationSettings } from './update-notification-settings';
import { getAccountSettings } from './get-account-settings';
import { updateAccountSettings } from './update-account-settings';
import { createProfileFromOrder } from './create-profile-from-order';
import { findProfilesByEmail } from './find-profiles-by-email';

export const profileRouter = {
    getProfile,
    updateProfile,
    getAccountStats,
    getProfileStats,
    getOrdersHistory,
    getOrderById,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getNotificationSettings,
    updateNotificationSettings,
    getAccountSettings,
    updateAccountSettings,
    createProfileFromOrder,
    findProfilesByEmail,
} satisfies TRPCRouterRecord; 
