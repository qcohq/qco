import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { protectedProcedure } from "../../../trpc";
import { adminInvitations, admins } from "@qco/db/schema";
import { AdminInvitationEmail, sendEmail } from "@qco/emails";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { env } from "../../../../env";
import { createAdminInvitationSchema } from "@qco/validators";

export const create = protectedProcedure
  .input(createAdminInvitationSchema)
  .mutation(async ({ input, ctx }) => {
    // Проверяем права супер-администратора
    if ((ctx.session?.user as any)?.role !== "super_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Недостаточно прав для создания приглашений",
      });
    }

    try {
      // Проверяем, не существует ли уже администратор с таким email
      const existingAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.email, input.email),
      });

      if (existingAdmin) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Администратор с таким email уже существует",
        });
      }

      // Проверяем, есть ли уже активное приглашение для этого email
      const existingInvitation = await ctx.db.query.adminInvitations.findFirst({
        where: eq(adminInvitations.email, input.email),
      });

      if (existingInvitation && existingInvitation.status === "pending") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Приглашение для этого email уже отправлено",
        });
      }

      // Создаем токен приглашения
      const token = createId();

      // Устанавливаем срок действия приглашения (7 дней)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Создаем приглашение
      const [invitation] = await ctx.db
        .insert(adminInvitations)
        .values({
          email: input.email,
          name: input.name,
          role: input.role,
          token,
          status: "pending",
          expiresAt,
          invitedBy: (ctx.session?.user as any)?.id,
        })
        .returning();

      if (!invitation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать приглашение",
        });
      }

      // Получаем данные пригласившего администратора
      const invitedByAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, ctx.session?.user?.id || ""),
      });

      // Формируем URL для принятия приглашения
      const invitationUrl = `${env.APP_URL}/admin-invitation/${token}`;

      // Отправляем email с приглашением
      try {
        await sendEmail({
          react: AdminInvitationEmail({
            name: input.name || input.email,
            email: input.email,
            role:
              input.role === "admin" ? "Администратор" : "Супер-администратор",
            invitedBy:
              invitedByAdmin?.name || invitedByAdmin?.email || "Администратор",
            invitationUrl,
            expiresAt: format(expiresAt, "dd MMMM yyyy 'в' HH:mm", {
              locale: ru,
            }),
          }),
          subject: "Приглашение стать администратором",
          to: [input.email],
        });
      } catch (error) {

        // Не прерываем выполнение, если email не удалось отправить
      }

      return {
        id: invitation.id,
        email: invitation.email,
        name: invitation.name,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        message: "Приглашение успешно создано и отправлено",
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Ошибка при создании приглашения",
      });
    }
  });
