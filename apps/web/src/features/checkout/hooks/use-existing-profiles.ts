import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    apartment?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    isGuest: boolean;
}

export function useExistingProfiles(email: string) {
    const trpc = useTRPC();

    const profilesQueryOptions = trpc.profile.findProfilesByEmail.queryOptions(
        { email },
        {
            enabled: email.length > 3 && email.includes("@"), // Запрос только если email валидный
            staleTime: 5 * 60 * 1000, // 5 минут
            gcTime: 10 * 60 * 1000, // 10 минут
        }
    );

    const {
        data: profiles,
        isPending: isLoading,
        error,
    } = useQuery(profilesQueryOptions);

    return {
        profiles: profiles || [],
        isLoading,
        error,
        hasProfiles: (profiles || []).length > 0,
    };
} 