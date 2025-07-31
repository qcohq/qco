import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { admins } from "@qco/db/schema";
import { toggleAdminStatusSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const toggleStatus = protectedProcedure
  .input(toggleAdminStatusSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof toggleAdminStatusSchema>, ctx: TRPCContext }) => {
    try {
      const { id, isActive } = input;

      // Проверяем, что текущий пользователь имеет права супер-администратора
      if ((ctx.session?.user as any)?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для изменения статуса администратора",
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

      // Нельзя деактивировать самого себя
      if (existingAdmin.id === ctx.session?.user?.id && !isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Нельзя деактивировать самого себя",
        });
      }

      // Обновляем статус администратора
      const [updatedAdmin] = await ctx.db
        .update(admins)
        .set({
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(admins.id, id))
        .returning();

      return updatedAdmin;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при изменении статуса администратора",
      });
    }
  }); 
