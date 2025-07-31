import { TRPCError } from "@trpc/server";
import { count, eq, gte, sql } from "@qco/db";
import { admins } from "@qco/db/schema";
import { getAdminsStatsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";
import type { TRPCContext } from "../../trpc";
import type { z } from "zod";

export const stats = protectedProcedure
  .input(getAdminsStatsSchema)
  .query(
    async ({
      input,
      ctx,
    }: {
      input: z.infer<typeof getAdminsStatsSchema>;
      ctx: TRPCContext;
    }) => {
      try {
        const { period } = input;

        // Определяем дату начала периода
        let startDate: Date;
        switch (period) {
          case "day":
            startDate = subDays(new Date(), 1);
            break;
          case "week":
            startDate = subWeeks(new Date(), 1);
            break;
          case "month":
            startDate = subMonths(new Date(), 1);
            break;
          case "year":
            startDate = subYears(new Date(), 1);
            break;
          default:
            startDate = subMonths(new Date(), 1);
        }

        // Получаем общее количество администраторов
        const totalCountResult = await ctx.db
          .select({ count: count() })
          .from(admins);

        const total = totalCountResult[0]?.count ?? 0;

        // Получаем количество активных администраторов
        const activeCountResult = await ctx.db
          .select({ count: count() })
          .from(admins)
          .where(eq(admins.isActive, true));

        const active = activeCountResult[0]?.count ?? 0;

        // Получаем количество администраторов, созданных за период
        const newCountResult = await ctx.db
          .select({ count: count() })
          .from(admins)
          .where(gte(admins.createdAt, startDate));

        const newThisPeriod = newCountResult[0]?.count ?? 0;

        // Получаем статистику по ролям
        const roleStatsResult = await ctx.db
          .select({
            role: admins.role,
            count: count(),
          })
          .from(admins)
          .groupBy(admins.role);

        const roleStats = roleStatsResult.reduce(
          (acc: Record<string, number>, item: any) => {
            acc[item.role] = item.count;
            return acc;
          },
          {} as Record<string, number>,
        );

        return {
          total,
          active,
          inactive: total - active,
          newThisPeriod,
          roleStats,
          period,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Ошибка при получении статистики администраторов",
        });
      }
    },
  );
