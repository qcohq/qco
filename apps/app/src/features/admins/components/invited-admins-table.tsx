import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, Copy, Mail, Share2, User } from "lucide-react";
import { toast } from "sonner";
import { env } from "~/env";
import type { AdminInvitation } from "@qco/validators";

interface InvitedAdminsTableProps {
  invitations: AdminInvitation[];
  onResend?: (id: string) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

export function InvitedAdminsTable({
  invitations,
  onResend,
  onCancel,
  isLoading,
}: InvitedAdminsTableProps) {
  const handleCopyInvitationLink = (_invitationId: string, token?: string) => {
    if (!token) {
      toast.error("Не удалось скопировать ссылку приглашения");
      return;
    }

    // Используем правильный формат URL из API
    const invitationLink = `${env.NEXT_PUBLIC_APP_URL}/admin-invitation/${token}`;
    navigator.clipboard
      .writeText(invitationLink)
      .then(() => {
        toast.success("Ссылка приглашения скопирована в буфер обмена");
      })
      .catch(() => {
        toast.error("Не удалось скопировать ссылку приглашения");
      });
  };

  const handleShareInvitationLink = async (
    invitationId: string,
    token?: string,
  ) => {
    if (!token) {
      toast.error("Не удалось поделиться ссылкой приглашения");
      return;
    }

    const invitationLink = `${env.APP_URL}/admin-invitation/${token}`;

    // Проверяем поддержку Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Приглашение в административную панель",
          text: "Перейдите по ссылке для принятия приглашения",
          url: invitationLink,
        });
        toast.success("Ссылка успешно отправлена");
      } catch (error) {
        // Пользователь отменил действие или произошла ошибка
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("Не удалось поделиться ссылкой");
        }
      }
    } else {
      // Если Web Share API не поддерживается, копируем в буфер обмена
      handleCopyInvitationLink(invitationId, token);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "accepted":
        return "Принято";
      case "expired":
        return "Истекло";
      case "cancelled":
        return "Отменено";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "accepted":
        return "secondary";
      case "expired":
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действует до</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="w-[200px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Mail className="w-10 h-10 text-muted-foreground mb-2" />
                    <div className="text-lg font-semibold">
                      Нет приглашённых администраторов
                    </div>
                    <div className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Пока никто не был приглашён. Используйте кнопку{" "}
                      <b>"Пригласить"</b> для добавления новых админов.
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{inv.email}</TableCell>
                  <TableCell>{inv.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inv.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(inv.status)}>
                      {getStatusLabel(inv.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(inv.expiresAt), "dd.MM.yyyy HH:mm", {
                      locale: ru,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(inv.createdAt), "dd.MM.yyyy HH:mm", {
                      locale: ru,
                    })}
                  </TableCell>
                  <TableCell>
                    {inv.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleCopyInvitationLink(
                              inv.id,
                              inv.invitationToken,
                            )
                          }
                          disabled={isLoading}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Копировать
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleShareInvitationLink(
                              inv.id,
                              inv.invitationToken,
                            )
                          }
                          disabled={isLoading}
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Поделиться
                        </Button>
                        {onResend && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onResend(inv.id)}
                            disabled={isLoading}
                          >
                            Повторить
                          </Button>
                        )}
                        {onCancel && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onCancel(inv.id)}
                            disabled={isLoading}
                          >
                            Отменить
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4 p-4">
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Mail className="w-10 h-10 text-muted-foreground mb-2" />
            <div className="text-lg font-semibold">
              Нет приглашённых администраторов
            </div>
            <div className="text-muted-foreground text-sm max-w-xs mx-auto">
              Пока никто не был приглашён. Используйте кнопку{" "}
              <b>"Пригласить"</b> для добавления новых админов.
            </div>
          </div>
        ) : (
          invitations.map((inv) => (
            <div
              key={inv.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{inv.email}</span>
                </div>
                <Badge variant={getStatusVariant(inv.status)}>
                  {getStatusLabel(inv.status)}
                </Badge>
              </div>

              {inv.name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{inv.name}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{inv.role}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Действует до:{" "}
                  {format(new Date(inv.expiresAt), "dd.MM.yyyy HH:mm", {
                    locale: ru,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Создано:{" "}
                  {format(new Date(inv.createdAt), "dd.MM.yyyy HH:mm", {
                    locale: ru,
                  })}
                </span>
              </div>

              {inv.status === "pending" && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyInvitationLink(inv.id, inv.invitationToken)
                    }
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Копировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleShareInvitationLink(inv.id, inv.invitationToken)
                    }
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться
                  </Button>
                  {onResend && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResend(inv.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Повторить
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onCancel(inv.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Отменить
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
