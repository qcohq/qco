import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useSession } from "./use-session";

export function useAddresses(userId?: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSession();

  // Получение адресов
  const addressesQueryOptions = trpc.profile.getAddresses.queryOptions(
    { userId },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
      enabled: isAuthenticated, // Запрос выполняется только если пользователь авторизован
    },
  );

  const {
    data: addresses,
    isPending: addressesLoading,
    error: addressesError,
  } = useQuery(addressesQueryOptions);
  // Создание адреса
  const createAddressMutationOptions =
    trpc.profile.createAddress.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getAddresses.queryKey(),
        });
        toast.success("Адрес добавлен", {
          description: "Новый адрес успешно сохранен",
        });
      },
      onError: (error: any) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось добавить адрес",
        });
      },
    });

  const { mutate: createAddress, isPending: isCreating } = useMutation(
    createAddressMutationOptions,
  );

  // Обновление адреса
  const updateAddressMutationOptions =
    trpc.profile.updateAddress.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getAddresses.queryKey(),
        });
        toast.success("Адрес обновлен", {
          description: "Адрес успешно изменен",
        });
      },
      onError: (error: any) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось обновить адрес",
        });
      },
    });

  const { mutate: updateAddress, isPending: isUpdating } = useMutation(
    updateAddressMutationOptions,
  );

  // Удаление адреса
  const deleteAddressMutationOptions =
    trpc.profile.deleteAddress.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getAddresses.queryKey(),
        });
        toast.success("Адрес удален", {
          description: "Адрес успешно удален",
        });
      },
      onError: (error: any) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось удалить адрес",
        });
      },
    });

  const { mutate: deleteAddress, isPending: isDeleting } = useMutation(
    deleteAddressMutationOptions,
  );

  return {
    addresses,
    addressesLoading,
    addressesError,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
