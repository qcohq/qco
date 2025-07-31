import { TRPCError } from "@trpc/server";
import { eq, inArray } from "@qco/db";
import { admins } from "@qco/db/schema";
import { bulkDeleteAdminsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const bulkDelete = protectedProcedure
  .input(bulkDeleteAdminsSchema)
  .mutation(async ({ input, ctx }: { input: z.infer<typeof bulkDeleteAdminsSchema>, ctx: TRPCContext }) => {
    try {
      const { ids } = input;

      // Проверяем, что текущий пользователь имеет права супер-администратора
      if ((ctx.session?.user as any)?.role !== "super_admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Недостаточно прав для массового удаления администраторов",
        });
      }

      // Проверяем, что текущий пользователь не пытается удалить самого себя
      const currentUserId = ctx.session?.user?.id;
      if (currentUserId && ids.includes(currentUserId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Нельзя удалить самого себя",
        });
      }

      // Проверяем существование всех администраторов
      const existingAdmins = await ctx.db.query.admins.findMany({
        where: inArray(admins.id, ids),
      });

      if (existingAdmins.length !== ids.length) {
        const existingIds = existingAdmins.map((admin: typeof admins.$inferSelect) => admin.id);
        const missingIds = ids.filter(id => !existingIds.includes(id));
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Администраторы с ID ${missingIds.join(", ")} не найдены`,
        });
      }

      // Удаляем администраторов
      await ctx.db.delete(admins).where(inArray(admins.id, ids));

      return {
        success: true,
        deletedCount: ids.length
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при массовом удалении администраторов",
      });
    }
  }); 
