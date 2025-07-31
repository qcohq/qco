import { z } from "zod";

import { publicProcedure } from "../../trpc";
import { db } from "@qco/db/client";
import { checkoutDrafts } from "@qco/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * Удаление черновика оформления заказа
 * Поддерживает как авторизованных пользователей (customerId), 
 * так и анонимных пользователей (sessionId)
 */
export const deleteDraft = publicProcedure
    .input(
        z.object({
            customerId: z.string().optional(),
            sessionId: z.string().optional(),
            draftId: z.string().optional(), // Опциональный ID конкретного черновика
        })
    )
    .mutation(async ({ input }) => {
        const { customerId, sessionId, draftId } = input;

        // Проверяем, что передан хотя бы один идентификатор
        if (!customerId && !sessionId && !draftId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Требуется customerId, sessionId или draftId",
            });
        }

        try {
            let deletedCount = 0;

            if (draftId) {
                // Удаляем конкретный черновик по ID
                const deletedDraft = await db
                    .delete(checkoutDrafts)
                    .where(eq(checkoutDrafts.id, draftId))
                    .returning();

                deletedCount = deletedDraft.length;
            } else if (customerId) {
                // Удаляем все черновики пользователя
                const deletedDrafts = await db
                    .delete(checkoutDrafts)
                    .where(eq(checkoutDrafts.customerId, customerId))
                    .returning();

                deletedCount = deletedDrafts.length;
            } else if (sessionId) {
                // Удаляем все черновики сессии
                const deletedDrafts = await db
                    .delete(checkoutDrafts)
                    .where(eq(checkoutDrafts.sessionId, sessionId))
                    .returning();

                deletedCount = deletedDrafts.length;
            }

            return {
                success: true,
                deletedCount,
                message: `Удалено черновиков: ${deletedCount}`,
            };
        } catch (error) {
            console.error("Ошибка при удалении черновика:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось удалить черновик",
            });
        }
    }); 