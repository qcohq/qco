import { TRPCError } from "@trpc/server";
import { eq, and } from "@qco/db";
import { admins, accounts } from "@qco/db/schema";
import { updateAdminSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";
import { auth } from "@qco/auth";

export const update = protectedProcedure
  .input(updateAdminSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof updateAdminSchema>, ctx: TRPCContext }) => {
    try {
      const { id, ...updateData } = input;

      // Проверяем, что текущий пользователь имеет права супер-администратора
      if (ctx.session?.user?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для обновления администратора",
        });
      }

      // Проверяем существование администратора
      const existingAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, id),
      });

      if (!existingAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Администратор с ID ${id} не найден`,
        });
      }

      // Если обновляется email, проверяем уникальность
      if (updateData.email && updateData.email !== existingAdmin.email) {
        const adminWithSameEmail = await ctx.db.query.admins.findFirst({
          where: eq(admins.email, updateData.email),
        });

        if (adminWithSameEmail) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Администратор с таким email уже существует",
          });
        }
      }

      // Подготавливаем данные для обновления
      const dataToUpdate: Record<string, unknown> = {
        ...updateData,
        updatedAt: new Date(),
      };

      // Если указан новый пароль, обновляем его с помощью better-auth
      if ('password' in input && typeof input.password === 'string') {
        // Пароль хранится в таблице Account, а не в таблице Admin
        // Находим аккаунт администратора с провайдером email
        const adminAccount = await ctx.db.query.accounts.findFirst({
          where: and(
            eq(accounts.userId, id),
            eq(accounts.providerId, "credential")
          ),
        });

        if (adminAccount) {
          // Используем better-auth для хеширования пароля
          const authContext = await auth.$context;
          const hashedPassword = await authContext.password.hash(input.password);
          // Обновляем пароль в таблице Account
          await ctx.db
            .update(accounts)
            .set({
              password: hashedPassword,
              updatedAt: new Date()
            })
            .where(eq(accounts.id, adminAccount.id));
        }

        // Удаляем пароль из объекта обновления, так как он не хранится в таблице Admin
        delete dataToUpdate.password;
      }

      // Обновляем администратора
      const [updated] = await ctx.db
        .update(admins)
        .set(dataToUpdate)
        .where(eq(admins.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось обновить администратора",
        });
      }

      return updated;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при обновлении администратора",
      });
    }
  }); 
