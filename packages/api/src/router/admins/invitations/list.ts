import { TRPCError } from "@trpc/server";
import { eq, like, desc, asc, or, count } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

import { protectedProcedure } from "../../../trpc";
import { adminInvitations } from "@qco/db/schema";
import { getAdminInvitationsSchema } from "@qco/validators";

export const list = protectedProcedure
  .input(getAdminInvitationsSchema)
  .query(async ({ input, ctx }) => {
    // Проверяем права супер-администратора
    if ((ctx.session?.user as any)?.role !== "super_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Недостаточно прав для просмотра приглашений",
      });
    }

    try {
      const { limit, offset, search, status, sortBy, sortDirection } = input;

      // Строим условия для запроса
      let whereCondition: SQL | undefined;

      if (search || status) {
        const conditions = [];

        if (search) {
          conditions.push(
            like(adminInvitations.email, `%${search}%`),
            like(adminInvitations.name, `%${search}%`),
          );
        }

        if (status) {
          conditions.push(eq(adminInvitations.status, status));
        }

        if (search && status) {
          whereCondition = or(...conditions);
        } else {
          whereCondition = conditions[0];
        }
      }

      // Получаем общее количество приглашений
      const totalQuery = await ctx.db
        .select({ count: count() })
        .from(adminInvitations)
        .where(whereCondition);

      const total = Number(totalQuery[0]?.count || 0);

      // Получаем приглашения с пагинацией и сортировкой
      const invitations = await ctx.db
        .select()
        .from(adminInvitations)
        .where(whereCondition)
        .orderBy(
          sortDirection === "desc"
            ? desc(adminInvitations[sortBy])
            : asc(adminInvitations[sortBy]),
        )
        .limit(limit)
        .offset(offset);

      return {
        invitations: invitations.map((invitation: any) => ({
          id: invitation.id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
          acceptedAt: invitation.acceptedAt,
          invitedBy: invitation.invitedBy,
          createdAt: invitation.createdAt,
          updatedAt: invitation.updatedAt,
          // Добавляем токен приглашения для формирования ссылки
          invitationToken: invitation.token,
        })),
        total,
        limit,
        offset,
      };
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ошибка при получении списка приглашений",
      });
    }
  });
