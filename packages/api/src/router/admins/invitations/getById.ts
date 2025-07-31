import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { adminInvitations } from "@qco/db/schema";
import { getAdminInvitationByIdSchema } from "@qco/validators";
import { protectedProcedure } from "../../../trpc";
import type { TRPCContext } from "../../../trpc";
import type { z } from "zod";

export const getById = protectedProcedure
  .input(getAdminInvitationByIdSchema)
  .query(async ({ input, ctx }: { input: z.infer<typeof getAdminInvitationByIdSchema>, ctx: TRPCContext }) => {
    try {
      const invitation = await ctx.db.query.adminInvitations.findFirst({
        where: eq(adminInvitations.id, input.id),
      });
      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Приглашение с ID ${input.id} не найдено`,
        });
      }
      return invitation;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при получении приглашения",
      });
    }
  }); 
