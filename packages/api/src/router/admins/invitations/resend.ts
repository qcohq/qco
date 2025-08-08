import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { protectedProcedure } from "../../../trpc";
import { adminInvitations, admins } from "@qco/db/schema";
import { sendEmail, AdminInvitationEmail } from "@qco/emails";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { env } from "../../../../env";
import { resendAdminInvitationSchema } from "@qco/validators";

export const resend = protectedProcedure
  .input(resendAdminInvitationSchema)
  .mutation(async ({ input, ctx }) => {
    // Проверяем права супер-администратора
    if ((ctx.session?.user as any)?.role !== "super_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Недостаточно прав для повторной отправки приглашений",
      });
    }

    try {
      // Находим приглашение
      const invitation = await ctx.db.query.adminInvitations.findFirst({
        where: eq(adminInvitations.id, input.invitationId),
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Приглашение не найдено",
        });
      }

      // Проверяем, что приглашение еще не принято
      if (invitation.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Приглашение уже было принято или отменено",
        });
      }

      // Проверяем, не истекло ли приглашение
      if (invitation.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Приглашение истекло",
        });
      }

      // Генерируем новый токен
      const newToken = createId();

      // Обновляем срок действия (еще 7 дней)
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      // Обновляем приглашение
      const [updatedInvitation] = await ctx.db
        .update(adminInvitations)
        .set({
          token: newToken,
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
        })
        .where(eq(adminInvitations.id, input.invitationId))
        .returning();

      if (!updatedInvitation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось обновить приглашение",
        });
      }

      // Получаем данные пригласившего администратора
      const invitedByAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, updatedInvitation.invitedBy),
      });

      // Формируем URL для приглашения
      const invitationUrl = `${env.APP_URL}/admin-invitation/${newToken}`;

      // Отправляем email
      try {
        await sendEmail({
          react: AdminInvitationEmail({
            name: updatedInvitation.name || updatedInvitation.email,
            email: updatedInvitation.email,
            role:
              updatedInvitation.role === "admin"
                ? "Администратор"
                : updatedInvitation.role === "moderator"
                  ? "Модератор"
                  : "Редактор",
            invitedBy:
              invitedByAdmin?.name || invitedByAdmin?.email || "Администратор",
            invitationUrl,
            expiresAt: format(newExpiresAt, "dd MMMM yyyy 'в' HH:mm", {
              locale: ru,
            }),
          }),
          subject: "Приглашение стать администратором (повторная отправка)",
          to: [updatedInvitation.email],
        });
      } catch (emailError) {

        // Не прерываем выполнение, если email не отправился
      }

      return {
        id: updatedInvitation.id,
        email: updatedInvitation.email,
        name: updatedInvitation.name,
        role: updatedInvitation.role,
        status: updatedInvitation.status,
        expiresAt: updatedInvitation.expiresAt,
        message: "Приглашение успешно обновлено и отправлено повторно",
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при повторной отправке приглашения",
      });
    }
  });
