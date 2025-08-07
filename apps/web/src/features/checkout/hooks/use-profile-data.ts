"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { useSession } from "@/features/user-auth/hooks/use-session";

export interface ProfileData {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
}

export interface AddressData {
    id: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isPrimary?: boolean;
    notes?: string | null;
    isDefault?: boolean;
}

export function useProfileDataForCheckout() {
    const trpc = useTRPC();
    const { isAuthenticated } = useSession();

    // Получаем данные профиля
    const profileQueryOptions = trpc.profile.getProfile.queryOptions(
        {},
        {
            enabled: isAuthenticated,
            staleTime: 5 * 60 * 1000, // 5 минут
            gcTime: 10 * 60 * 1000, // 10 минут
        },
    );

    const {
        data: profile,
        isPending: isProfileLoading,
        error: profileError,
    } = useQuery(profileQueryOptions);

    // Получаем адреса пользователя
    const addressesQueryOptions = trpc.profile.getAddresses.queryOptions(
        {},
        {
            enabled: isAuthenticated,
            staleTime: 5 * 60 * 1000, // 5 минут
            gcTime: 10 * 60 * 1000, // 10 минут
        },
    );

    const {
        data: addresses,
        isPending: isAddressesLoading,
        error: addressesError,
    } = useQuery(addressesQueryOptions);

    // Форматируем данные профиля для checkout формы
    const profileData: ProfileData = {
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        phone: profile?.phone,
    };

    // Форматируем адреса для checkout формы
    const formattedAddresses: AddressData[] = addresses?.map((address) => ({
        id: address.id,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        state: address.state || "",
        postalCode: address.postalCode,
        country: address.country,
        isPrimary: address.isPrimary,
        notes: address.notes,
        isDefault: address.isPrimary, // маппинг isPrimary -> isDefault
    })) || [];

    // Находим основной адрес
    const primaryAddress = formattedAddresses.find((addr) => addr.isPrimary) ||
        formattedAddresses[0] ||
        null;

    const isLoading = isProfileLoading || isAddressesLoading;
    const hasError = profileError || addressesError;

    return {
        // Данные профиля
        profile: profileData,
        profileLoading: isProfileLoading,
        profileError,

        // Данные адресов  
        addresses: formattedAddresses,
        addressesLoading: isAddressesLoading,
        addressesError,

        // Основной адрес
        primaryAddress,

        // Общие состояния
        isLoading,
        hasError,
        isAuthenticated,

        // Утилиты
        hasProfileData: !!(profile?.firstName && profile?.lastName && profile?.email),
        hasAddresses: formattedAddresses.length > 0,
    };
} 