import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { admins } from "@qco/db/schema";
import { getAdminByIdSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const getById = protectedProcedure
  .input(getAdminByIdSchema)
  .query(async ({ input, ctx }: { input: z.infer<typeof getAdminByIdSchema>, ctx: TRPCContext }) => {
    try {
      const admin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, input.id),
      });

      if (!admin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Администратор с ID ${input.id} не найден`,
        });
      }

      return admin;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при получении администратора",
      });
    }
  }); 
