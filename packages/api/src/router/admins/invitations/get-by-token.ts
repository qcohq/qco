import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { adminInvitations } from "@qco/db/schema";
import { publicProcedure } from "../../../trpc";
import type { TRPCContext } from "../../../trpc";
import { z } from "zod";

const getAdminInvitationByTokenSchema = z.object({
  token: z.string(),
});

export const getByToken = publicProcedure
  .input(getAdminInvitationByTokenSchema)
  .query(
    async ({
      input,
      ctx,
    }: {
      input: z.infer<typeof getAdminInvitationByTokenSchema>;
      ctx: TRPCContext;
    }) => {
      try {
        const invitation = await ctx.db.query.adminInvitations.findFirst({
          where: eq(adminInvitations.token, input.token),
          with: {
            invitedByAdmin: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        });

        if (!invitation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Приглашение не найдено",
          });
        }

        if (invitation.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Приглашение уже использовано или отменено",
          });
        }

        if (invitation.expiresAt < new Date()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Срок действия приглашения истёк",
          });
        }

        return {
          id: invitation.id,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
          invitedBy:
            invitation.invitedByAdmin?.name ||
            invitation.invitedByAdmin?.email ||
            "Администратор",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Ошибка при получении приглашения",
        });
      }
    },
  );
