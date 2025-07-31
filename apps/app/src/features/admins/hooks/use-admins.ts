import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";

interface ToggleStatusData {
  id: string;
  status: boolean;
}

interface ChangeRoleData {
  id: string;
  role: string;
}

export function useAdminsList(page: number, perPage: number, search?: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.admins.list.queryOptions({
    page,
    limit: perPage,
    search,
  });

  return useQuery(queryOptions);
}

export function useCreateAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.admins.create.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.admins.list.queryKey(),
      });

      toast.success(`Администратор "${data.name}" успешно создан`);
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось создать администратора");
    },
  });

  return useMutation(mutationOptions);
}

export function useUpdateAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.admins.update.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.admins.list.queryKey(),
      });

      toast.success(`Администратор "${data.name}" успешно обновлён`);
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось обновить администратора");
    },
  });

  return useMutation(mutationOptions);
}

export function useDeleteAdmin() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.admins.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.admins.list.queryKey(),
      });

      toast.success("Администратор успешно удалён");
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось удалить администратора");
    },
  });

  return useMutation(mutationOptions);
}

export function useToggleAdminStatus() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleStatusData) =>
      trpc.admins.toggleStatus.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Статус администратора обновлен");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Не удалось обновить статус");
    },
  });
}

export function useChangeAdminRole() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeRoleData) => trpc.admins.changeRole.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Роль администратора изменена");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Не удалось изменить роль");
    },
  });
}

export function useInvitedAdmins(
  search?: string,
  _page?: number,
  perPage?: number,
  offset?: number,
) {
  const trpc = useTRPC();

  const queryOptions = trpc.admins.invitations.list.queryOptions({
    search,
    limit: perPage,
    offset,
  });

  return useQuery(queryOptions);
}

export function useResendInvitation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.admins.invitations.resend.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.admins.invitations.list.queryKey(),
      });

      toast.success(
        `Приглашение для ${data.email} успешно отправлено повторно`,
      );
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось отправить приглашение повторно");
    },
  });

  return useMutation(mutationOptions);
}

export function useCancelInvitation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.admins.invitations.cancel.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.admins.invitations.list.queryKey(),
      });

      toast.success(`Приглашение для ${data.email} успешно отменено`);
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось отменить приглашение");
    },
  });

  return useMutation(mutationOptions);
}
