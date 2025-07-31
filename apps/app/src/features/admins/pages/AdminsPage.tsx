"use client";

import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import type { Admin, AdminListResponse } from "@qco/validators";
import { Plus, Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { AdminErrorState } from "../components/admin-error-state";
import { AdminLoadingState } from "../components/admin-loading-state";
import { AdminPagination } from "../components/admin-pagination";
import { AdminTable } from "../components/admin-table";
import { CreateAdminForm } from "../components/create-admin-form";
import { EditAdminForm } from "../components/edit-admin-form";
import { InviteAdminForm } from "../components/invite-admin-form";
import { InvitedAdminsTable } from "../components/invited-admins-table";
import { AdminsSkeleton } from "../components/admins-skeleton";
import {
  useAdminsList,
  useCancelInvitation,
  useCreateAdmin,
  useDeleteAdmin,
  useInvitedAdmins,
  useResendInvitation,
  useUpdateAdmin,
} from "../hooks/use-admins";

export function AdminsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const { data, isPending, error } = useAdminsList(page, 20, search);
  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
  const {
    data: invitedData,
    isPending: isInvitedLoading,
    error: invitedError,
  } = useInvitedAdmins(search, undefined, 20, 0);
  const { mutate: resendInvitation, isPending: isResending } =
    useResendInvitation();
  const { mutate: cancelInvitation, isPending: isCancelling } =
    useCancelInvitation();

  const handleCreateAdmin = (formData: z.infer<typeof createAdminSchema>) => {
    createAdmin(formData);
    setIsCreateDialogOpen(false);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = (formData: z.infer<typeof updateAdminSchema>) => {
    updateAdmin(formData);
    setIsEditDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Вы уверены, что хотите удалить этого администратора?")) {
      deleteAdmin({ id: adminId });
    }
  };

  const handleResendInvitation = (invitationId: string) => {
    resendInvitation({ invitationId });
  };

  const handleCancelInvitation = (invitationId: string) => {
    if (confirm("Вы уверены, что хотите отменить это приглашение?")) {
      cancelInvitation({ invitationId });
    }
  };

  if (error) {
    return <AdminErrorState message={error.message} />;
  }

  const adminData = data as AdminListResponse | undefined;
  const admins = adminData?.items || [];
  const meta = adminData?.meta;

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Администраторы</h1>
          <p className="text-muted-foreground">
            Управление администраторами системы
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Пригласить
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Поиск и статистика */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск администраторов..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Всего администраторов: {meta?.total ?? 0}</span>
        </div>
      </div>

      {/* Таблица администраторов */}
      <div className="rounded-lg border bg-card">
        {isPending ? (
          <AdminsSkeleton />
        ) : (
          <>
            <AdminTable
              admins={admins}
              onEdit={handleEditAdmin}
              onDelete={handleDeleteAdmin}
              isDeleting={isDeleting}
            />

            {meta && meta.total > 0 && (
              <div className="border-t p-4">
                <AdminPagination
                  currentPage={page}
                  totalPages={meta.pageCount}
                  totalItems={meta.total}
                  itemsPerPage={20}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Таблица приглашённых админов */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Приглашённые администраторы
            </h2>
            <p className="text-sm text-muted-foreground">
              Ожидающие подтверждения приглашения
            </p>
          </div>
        </div>
        <div className="p-0">
          {isInvitedLoading ? (
            <AdminLoadingState />
          ) : invitedError ? (
            <AdminErrorState message={invitedError.message} />
          ) : (
            <InvitedAdminsTable
              invitations={invitedData?.invitations || []}
              onResend={handleResendInvitation}
              onCancel={handleCancelInvitation}
              isLoading={isResending || isCancelling}
            />
          )}
        </div>
      </div>

      {/* Диалог создания администратора */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Добавить администратора</DialogTitle>
          </DialogHeader>
          <CreateAdminForm
            onSubmit={handleCreateAdmin}
            isPending={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования администратора */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Редактировать администратора</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <EditAdminForm
              admin={selectedAdmin}
              onSubmit={handleUpdateAdmin}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог приглашения администратора */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Пригласить администратора</DialogTitle>
          </DialogHeader>
          <InviteAdminForm onSuccess={() => setIsInviteDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
