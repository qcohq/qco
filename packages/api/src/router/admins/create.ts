import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { admins } from "@qco/db/schema";
import { createAdminSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import { auth } from "@qco/auth";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const create = protectedProcedure
  .input(createAdminSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof createAdminSchema>, ctx: TRPCContext }) => {
    try {
      const { name, email, role, isActive } = input;

      // Проверяем, что текущий пользователь имеет права супер-администратора
      if ((ctx.session?.user as any)?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для создания администратора",
        });
      }

      // Проверяем, не существует ли уже администратор с таким email
      const existingAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.email, email),
      });

      if (existingAdmin) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Администратор с таким email уже существует",
        });
      }

      // Получаем контекст Better Auth для хеширования пароля
      const authContext = await auth.$context;

      // Генерируем временный пароль (администратор сможет его изменить позже)
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + "!1";

      // Хешируем пароль с помощью Better Auth
      const passwordHash = await authContext.password.hash(tempPassword);

      // Создаем нового администратора
      const user = await authContext.internalAdapter.createUser({
        email,
        name,
        role,
        isActive,
        emailVerified: false,
      });
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать администратора",
        });
      }

      // Привязываем пароль к пользователю
      await authContext.internalAdapter.linkAccount(
        {
          accountId: user.id,
          providerId: "credential",
          password: passwordHash,
          userId: user.id,
        },
        authContext as any
      );

      return {
        ...user,
        tempPassword, // Возвращаем временный пароль для отправки администратору
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при создании администратора",
      });
    }
  }); 
