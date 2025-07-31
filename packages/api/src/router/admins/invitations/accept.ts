import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../../../trpc";
import { adminInvitations, admins } from "@qco/db/schema";
import { auth } from "@qco/auth";
import { acceptAdminInvitationSchema } from "@qco/validators";

export const acceptInvitationRouter = createTRPCRouter({
  accept: publicProcedure
    .input(acceptAdminInvitationSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Находим приглашение по токену
        const invitation = await ctx.db.query.adminInvitations.findFirst({
          where: eq(adminInvitations.token, input.token),
        });

        if (!invitation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Приглашение не найдено или токен недействителен",
          });
        }

        // Проверяем, не истекло ли приглашение
        if (invitation.expiresAt < new Date()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Приглашение истекло",
          });
        }

        // Проверяем, не было ли приглашение уже использовано
        if (invitation.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Приглашение уже было использовано или отменено",
          });
        }

        // Проверяем, не существует ли уже администратор с таким email
        const existingAdmin = await ctx.db.query.admins.findFirst({
          where: eq(admins.email, invitation.email),
        });

        if (existingAdmin) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Администратор с таким email уже существует",
          });
        }

        // Получаем контекст Better Auth
        const authContext = await auth.$context;

        // 1. Создаём пользователя без пароля через Better Auth
        const user = await authContext.internalAdapter.createUser({
          email: invitation.email,
          name: input.name,
          role: invitation.role,
          isActive: true,
          emailVerified: true,
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Не удалось создать администратора",
          });
        }

        // 2. Хешируем пароль
        const hashedPassword = await authContext.password.hash(input.password);

        // 3. Привязываем пароль к пользователю через Better Auth
        await authContext.internalAdapter.linkAccount(
          {
            accountId: user.id,
            providerId: "credential",
            password: hashedPassword,
            userId: user.id,
          },
          authContext as any,
        );

        // 4. Помечаем приглашение как принятое
        await ctx.db
          .update(adminInvitations)
          .set({
            status: "accepted",
            acceptedAt: new Date(),
            acceptedBy: user.id,
          })
          .where(eq(adminInvitations.id, invitation.id));

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: invitation.role,
          message: "Приглашение успешно принято",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;


        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Ошибка при принятии приглашения",
        });
      }
    }),
});
