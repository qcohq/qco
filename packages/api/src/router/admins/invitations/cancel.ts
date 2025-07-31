import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { protectedProcedure } from "../../../trpc";
import { adminInvitations } from "@qco/db/schema";
import { cancelAdminInvitationSchema } from "@qco/validators";

export const cancel = protectedProcedure
  .input(cancelAdminInvitationSchema)
  .mutation(async ({ input, ctx }) => {
    // Проверяем права супер-администратора
    if ((ctx.session?.user as any)?.role !== "super_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Недостаточно прав для отмены приглашений",
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

      // Отменяем приглашение
      const [cancelledInvitation] = await ctx.db
        .update(adminInvitations)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(adminInvitations.id, input.invitationId))
        .returning();

      if (!cancelledInvitation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось отменить приглашение",
        });
      }

      return {
        id: cancelledInvitation.id,
        email: cancelledInvitation.email,
        name: cancelledInvitation.name,
        role: cancelledInvitation.role,
        status: cancelledInvitation.status,
        message: "Приглашение успешно отменено",
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при отмене приглашения",
      });
    }
  }); 
