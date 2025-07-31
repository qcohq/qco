import { protectedProcedure } from "../../trpc";
import { admins } from "@qco/db/schema";
import { eq } from "@qco/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getProfile = protectedProcedure
  .output(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      email: z.string(),
      emailVerified: z.boolean(),
      image: z.string().nullable(),
      role: z.enum(["super_admin", "admin", "moderator", "editor"]),
      isActive: z.boolean(),
      lastLoginAt: z.date().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  )
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const admin = await ctx.db.query.admins.findFirst({
        where: eq(admins.id, userId),
      });

      if (!admin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });
      }

      return admin;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch profile",
      });
    }
  });
