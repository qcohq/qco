import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "../../trpc";
import { admins } from "@qco/db/schema";
import { auth } from "@qco/auth";
import { createSuperAdminSchema } from "@qco/validators";

export const createSuperAdminRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSuperAdminSchema)
    .mutation(async ({ input, ctx }) => {
      // Проверяем, есть ли уже администраторы в системе
      const existingAdmins = await ctx.db.select().from(admins);

      if (existingAdmins.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Суперадмин уже создан. Создание дополнительных суперадминов запрещено.",
        });
      }

      try {
        // Проверяем, не существует ли уже пользователь с таким email
        const existingAdmin = await ctx.db.query.admins.findFirst({
          where: eq(admins.email, input.email),
        });

        if (existingAdmin) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Пользователь с таким email уже существует",
          });
        }

        // Получаем контекст Better Auth
        const authContext = await auth.$context;

        // 1. Создаём пользователя без пароля
        const user = await authContext.internalAdapter.createUser({
          email: input.email,
          name: input.name,
          role: "super_admin",
          isActive: true,
          emailVerified: true,
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Не удалось создать суперадминистратора",
          });
        }

        // 2. Хешируем пароль
        const hashedPassword = await authContext.password.hash(input.password);

        // 3. Привязываем пароль к пользователю
        await authContext.internalAdapter.linkAccount(
          {
            accountId: user.id,
            providerId: "credential",
            password: hashedPassword,
            userId: user.id,
          },
          authContext as any
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "super_admin",
          message: "Первый суперадминистратор успешно создан",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;


        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Ошибка при создании суперадминистратора",
        });
      }
    }),
}); 
