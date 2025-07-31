import { z } from "zod";

import { publicProcedure } from "../../trpc";
import { db } from "@qco/db/client";
import { checkoutDrafts } from "@qco/db/schema";
import { and, isNull, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Очистка старых черновиков анонимных пользователей
 * Удаляет черновики старше указанного количества дней
 */
export const cleanupOldDrafts = publicProcedure
    .input(
        z.object({
            daysOld: z.number().min(1).max(365).default(30), // По умолчанию 30 дней
        })
    )
    .mutation(async ({ input }) => {
        const { daysOld } = input;

        try {
            // Вычисляем дату, старше которой черновики будут удалены
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            // Удаляем старые черновики анонимных пользователей
            const deletedDrafts = await db
                .delete(checkoutDrafts)
                .where(
                    and(
                        isNull(checkoutDrafts.customerId), // Только анонимные пользователи
                        lt(checkoutDrafts.updatedAt, cutoffDate) // Старше указанной даты
                    )
                )
                .returning();

            return {
                success: true,
                deletedCount: deletedDrafts.length,
                cutoffDate,
                message: `Удалено ${deletedDrafts.length} старых черновиков анонимных пользователей`,
            };
        } catch (error) {
            console.error("Ошибка при очистке старых черновиков:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось очистить старые черновики",
            });
        }
    }); 