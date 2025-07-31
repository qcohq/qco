import { TRPCError } from "@trpc/server";
import { count } from "@qco/db";
import { admins } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";

export const checkEmpty = publicProcedure
  .query(async ({ ctx }: { ctx: TRPCContext }) => {
    try {
      // Подсчитываем количество администраторов
      const result = await ctx.db
        .select({ count: count() })
        .from(admins);

      const adminCount = result[0]?.count ?? 0;

      return {
        isEmpty: adminCount === 0,
        count: adminCount,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при проверке администраторов",
      });
    }
  }); 
