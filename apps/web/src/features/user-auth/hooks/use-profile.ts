import type { AccountProfile, UpdateProfileInput } from "@qco/web-validators";
import { getProfileInput, type updateProfileInput } from "@qco/web-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useSession } from "./use-session";

export function useProfile(userId?: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSession();

  // Получение профиля
  const profileQueryOptions = trpc.profile.getProfile.queryOptions(
    { userId },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      enabled: isAuthenticated, // Запрос выполняется только если пользователь авторизован
    },
  );

  const {
    data: profile,
    isPending: profileLoading,
    error: profileError,
  } = useQuery(profileQueryOptions);

  // Обновление профиля
  const updateProfileMutationOptions =
    trpc.profile.updateProfile.mutationOptions({
      onSuccess: (updatedProfile: any) => {
        // Инвалидируем кэш профиля
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getProfile.queryKey(),
        });

        // Обновляем данные в кэше
        queryClient.setQueryData(
          trpc.profile.getProfile.queryKey({ userId }),
          updatedProfile,
        );

        toast.success("Профиль обновлен", {
          description: "Ваши данные успешно сохранены",
        });
      },
      onError: (error: any) => {
        console.error("Failed to update profile:", error);
        toast.error("Ошибка", {
          description: error.message || "Не удалось обновить профиль",
        });
      },
    });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation(
    updateProfileMutationOptions,
  );

  return {
    profile,
    profileLoading,
    profileError,
    updateProfile,
    isUpdating,
  };
}

export function useUpdateProfile() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: typeof updateProfileInput._type) =>
      trpc.profile.updateProfile.mutate(data),
    onSuccess: () => {
      // Инвалидируем кэш профиля
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
