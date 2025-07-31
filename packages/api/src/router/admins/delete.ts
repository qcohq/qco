import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { admins } from "@qco/db/schema";
import { deleteAdminSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const deleteAdmin = protectedProcedure
  .input(deleteAdminSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof deleteAdminSchema>, ctx: TRPCContext }) => {
    try {
      // Проверяем, что текущий пользователь имеет права супер-администратора
      if ((ctx.session?.user as any)?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для удаления администратора",
        });
      }

      // Проверяем существование администратора
      const existingAdmin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, input.id),
      });

      if (!existingAdmin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Администратор с ID ${input.id} не найден`,
        });
      }

      // Нельзя удалить самого себя
      if (existingAdmin.id === ctx.session?.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Нельзя удалить самого себя",
        });
      }

      // Удаляем администратора
      await ctx.db.delete(admins).where(eq(admins.id, input.id));

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при удалении администратора",
      });
    }
  }); 
