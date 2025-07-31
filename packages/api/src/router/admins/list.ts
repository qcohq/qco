import { TRPCError } from "@trpc/server";
import { count, desc, eq, ilike, and } from "@qco/db";
import { admins } from "@qco/db/schema";
import { getAdminsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const list = protectedProcedure
  .input(getAdminsSchema)
  .query(async ({ input, ctx }: { input: z.infer<typeof getAdminsSchema>, ctx: TRPCContext }) => {
    try {
      const { page, limit, search, role, isActive } = input;
      const offset = (page - 1) * limit;

      // Формируем условия фильтрации
      const conditions = [];

      if (search) {
        conditions.push(
          ilike(admins.name, `%${search}%`),
          ilike(admins.email, `%${search}%`)
        );
      }

      if (role) {
        conditions.push(eq(admins.role, role));
      }

      if (isActive !== undefined) {
        conditions.push(eq(admins.isActive, isActive));
      }

      // Получаем общее количество записей
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(admins)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = totalCountResult[0]?.count ?? 0;

      // Получаем администраторов с пагинацией
      const adminsList = await ctx.db.query.admins.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        limit,
        offset,
        orderBy: (fields, { desc }) => [desc(fields.createdAt)],
      });

      return {
        items: adminsList,
        meta: {
          total,
          pageCount: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
        pagination: {
          hasMore: offset + adminsList.length < total,
          total,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при получении списка администраторов",
      });
    }
  }); 
