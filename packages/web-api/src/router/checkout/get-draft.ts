import { checkoutFormSchema, checkoutDraftPartialSchema, validateDraftData } from "@qco/web-validators";
import { z } from "zod";

import { publicProcedure } from "../../trpc";
import { db } from "@qco/db/client";
import { checkoutDrafts } from "@qco/db/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Получение черновика оформления заказа
 * Поддерживает как авторизованных пользователей (customerId), 
 * так и анонимных пользователей (sessionId)
 */
export const getDraft = publicProcedure
  .input(
    z.object({
      customerId: z.string().optional(),
      sessionId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    // Проверяем, что передан хотя бы один идентификатор
    if (!input.customerId && !input.sessionId) {
      return {
        success: false,
        error: "Необходимо указать customerId или sessionId",
        data: null,
      };
    }

    try {
      let draft;

      if (input.customerId) {
        // Для авторизованных пользователей ищем по customerId
        // Приоритет отдаем черновикам с customerId, но без sessionId
        draft = await db.query.checkoutDrafts.findFirst({
          where: and(
            eq(checkoutDrafts.customerId, input.customerId),
            isNull(checkoutDrafts.sessionId)
          ),
          orderBy: (checkoutDrafts, { desc }) => [desc(checkoutDrafts.updatedAt)],
        });

        // Если не нашли черновик без sessionId, ищем любой с customerId
        if (!draft) {
          draft = await db.query.checkoutDrafts.findFirst({
            where: eq(checkoutDrafts.customerId, input.customerId),
            orderBy: (checkoutDrafts, { desc }) => [desc(checkoutDrafts.updatedAt)],
          });
        }
      } else if (input.sessionId) {
        // Для анонимных пользователей ищем по sessionId
        // Ищем черновики, которые принадлежат этой сессии
        draft = await db.query.checkoutDrafts.findFirst({
          where: eq(checkoutDrafts.sessionId, input.sessionId),
          orderBy: (checkoutDrafts, { desc }) => [desc(checkoutDrafts.updatedAt)],
        });
      }

      if (!draft) {
        return {
          success: true,
          data: null,
          message: "Черновик не найден",
        };
      }

      // Валидируем данные черновика с помощью новой схемы для частичных данных
      const validationResult = validateDraftData(draft.draftData);

      if (!validationResult.isValid) {
        return {
          success: false,
          error: "Invalid draft data",
          data: null,
          validationErrors: validationResult.errors
        };
      }

      return {
        success: true,
        data: {
          id: draft.id,
          customerId: draft.customerId,
          sessionId: draft.sessionId,
          draftData: validationResult.data,
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt
        },
        error: null
      };
    } catch (error) {
      console.error("Ошибка при получении черновика:", error);

      return {
        success: false,
        error: "Внутренняя ошибка сервера",
        data: null,
      };
    }
  });
