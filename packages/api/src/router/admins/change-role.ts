import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { admins } from "@qco/db/schema";
import { changeAdminRoleSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const changeRole = protectedProcedure
  .input(changeAdminRoleSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof changeAdminRoleSchema>, ctx: TRPCContext }) => {
    try {
      const { id, role } = input;

      // Проверяем, что текущий пользователь имеет права супер-администратора
      if ((ctx.session?.user as any)?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для изменения роли администратора",
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

      // Нельзя изменить роль самого себя
      if (existingAdmin.id === ctx.session?.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Нельзя изменить роль самого себя",
        });
      }

      // Обновляем роль администратора
      const [updatedAdmin] = await ctx.db
        .update(admins)
        .set({
          role,
          updatedAt: new Date(),
        })
        .where(eq(admins.id, id))
        .returning();

      return updatedAdmin;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при изменении роли администратора",
      });
    }
  }); 
