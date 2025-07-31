"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";
import type { InvitedAdmin } from "./invited-admins-table";
import { createAdminInvitationSchema } from "@qco/validators";

type CreateInvitationFormData = z.infer<typeof createAdminInvitationSchema>;

export function InvitationsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<InvitedAdmin | null>(null);

  const trpc = useTRPC();

  // Получение списка приглашений
  const { data: invitationsData, refetch } = useQuery({
    queryKey: ["invitations", search, statusFilter],
    queryFn: () =>
      trpc.admins.invitations.list.query({
        search: search || undefined,
        status: statusFilter || undefined,
        limit: 50,
        offset: 0,
      }),
  });

  // Создание приглашения
  const createInvitationMutation = useMutation({
    mutationFn: (data: CreateInvitationFormData) =>
      trpc.admins.invitations.create.mutate(data),
    onSuccess: () => {
      toast.success("Приглашение успешно создано и отправлено");
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ошибка при создании приглашения";
      toast.error(message);
    },
  });

  // Повторная отправка приглашения
  const resendInvitationMutation = useMutation({
    mutationFn: (invitationId: string) =>
      trpc.admins.invitations.resend.mutate({ invitationId }),
    onSuccess: () => {
      toast.success("Приглашение успешно отправлено повторно");
      setIsResendDialogOpen(false);
      refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ошибка при повторной отправке";
      toast.error(message);
    },
  });

  // Отмена приглашения
  const cancelInvitationMutation = useMutation({
    mutationFn: (invitationId: string) =>
      trpc.admins.invitations.cancel.mutate({ invitationId }),
    onSuccess: () => {
      toast.success("Приглашение успешно отменено");
      refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ошибка при отмене приглашения";
      toast.error(message);
    },
  });

  const form = useForm<CreateInvitationFormData>({
    resolver: zodResolver(createAdminInvitationSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "admin",
    },
  });

  const handleCreateInvitation = (data: CreateInvitationFormData) => {
    createInvitationMutation.mutate(data);
  };

  const handleResendInvitation = () => {
    if (selectedInvitation) {
      resendInvitationMutation.mutate(selectedInvitation.id);
    }
  };

  const handleCancelInvitation = (invitationId: string) => {
    if (confirm("Вы уверены, что хотите отменить это приглашение?")) {
      cancelInvitationMutation.mutate(invitationId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="default">Ожидает</Badge>;
      case "accepted":
        return <Badge variant="secondary">Принято</Badge>;
      case "expired":
        return <Badge variant="destructive">Истекло</Badge>;
      case "cancelled":
        return <Badge variant="outline">Отменено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "moderator":
        return "Модератор";
      case "editor":
        return "Редактор";
      default:
        return role;
    }
  };

  const invitations: InvitedAdmin[] = invitationsData?.invitations || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Управление приглашениями
              </CardTitle>
              <CardDescription>
                Создавайте и управляйте приглашениями для новых администраторов
              </CardDescription>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать приглашение
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать приглашение</DialogTitle>
                  <DialogDescription>
                    Отправьте приглашение новому администратору
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCreateInvitation)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Имя</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Имя администратора"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Роль</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите роль" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">
                                Администратор
                              </SelectItem>
                              <SelectItem value="moderator">
                                Модератор
                              </SelectItem>
                              <SelectItem value="editor">Редактор</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Отмена
                      </Button>
                      <Button
                        type="submit"
                        disabled={createInvitationMutation.isPending}
                      >
                        {createInvitationMutation.isPending ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Создание...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Создать
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по email или имени..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="accepted">Принято</SelectItem>
                <SelectItem value="expired">Истекло</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Срок действия</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{invitation.name}</TableCell>
                  <TableCell>{getRoleLabel(invitation.role)}</TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      {format(new Date(invitation.expiresAt), "dd.MM.yyyy", {
                        locale: ru,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {format(new Date(invitation.createdAt), "dd.MM.yyyy", {
                        locale: ru,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {invitation.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvitation(invitation);
                                setIsResendDialogOpen(true);
                              }}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Повторно отправить
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleCancelInvitation(invitation.id)
                              }
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Отменить
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {invitations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Приглашения не найдены
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог повторной отправки */}
      <Dialog open={isResendDialogOpen} onOpenChange={setIsResendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Повторная отправка приглашения</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите повторно отправить приглашение на email{" "}
              <strong>{selectedInvitation?.email}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResendDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleResendInvitation}
              disabled={resendInvitationMutation.isPending}
            >
              {resendInvitationMutation.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Отправить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
