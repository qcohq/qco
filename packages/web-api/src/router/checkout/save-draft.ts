import { checkoutDraftPartialSchema, validateDraftData } from "@qco/web-validators";
import { z } from "zod";

import { publicProcedure } from "../../trpc";
import { db } from "@qco/db/client";
import { checkoutDrafts } from "@qco/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const saveDraftInputSchema = z.object({
  customerId: z.string().optional(),
  sessionId: z.string().optional(),
  draftData: checkoutDraftPartialSchema, // Используем новую схему для частичных данных
});

/**
 * Сохранение черновика оформления заказа
 * Поддерживает как авторизованных пользователей (customerId), 
 * так и анонимных пользователей (sessionId)
 * Автоматически мигрирует черновики от анонимных к авторизованным пользователям
 */
export const saveDraft = publicProcedure
  .input(saveDraftInputSchema)
  .mutation(async ({ input }) => {
    const { customerId, sessionId, draftData } = input;

    // Проверяем, что передан хотя бы один идентификатор
    if (!customerId && !sessionId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Требуется customerId или sessionId",
      });
    }

    // Валидируем входящие данные
    const validationResult = validateDraftData(draftData);

    if (!validationResult.isValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Данные черновика не прошли валидацию",
        cause: validationResult.errors,
      });
    }

    try {
      let existingDraft;

      if (customerId) {
        // Для авторизованных пользователей
        // Сначала ищем черновик с customerId (без sessionId)
        existingDraft = await db
          .select()
          .from(checkoutDrafts)
          .where(and(
            eq(checkoutDrafts.customerId, customerId),
            isNull(checkoutDrafts.sessionId)
          ))
          .limit(1);

        // Если не нашли, ищем любой черновик с customerId
        if (!existingDraft || existingDraft.length === 0) {
          existingDraft = await db
            .select()
            .from(checkoutDrafts)
            .where(eq(checkoutDrafts.customerId, customerId))
            .limit(1);
        }

        // Если есть sessionId, проверяем есть ли черновик с этой сессией
        // для миграции от анонимного к авторизованному пользователю
        if (sessionId && (!existingDraft || existingDraft.length === 0)) {
          const sessionDraft = await db
            .select()
            .from(checkoutDrafts)
            .where(eq(checkoutDrafts.sessionId, sessionId))
            .limit(1);

          if (sessionDraft && sessionDraft.length > 0 && sessionDraft[0]) {
            // Мигрируем черновик от сессии к пользователю
            const migratedDraft = await db
              .update(checkoutDrafts)
              .set({
                customerId,
                sessionId: null, // Убираем sessionId, так как теперь это авторизованный пользователь
                draftData: {
                  ...(typeof sessionDraft[0].draftData === 'object' && sessionDraft[0].draftData !== null ? sessionDraft[0].draftData : {}),
                  ...validationResult.data, // Используем валидированные данные
                },
                updatedAt: new Date(),
              })
              .where(eq(checkoutDrafts.id, sessionDraft[0].id))
              .returning();

            if (migratedDraft && migratedDraft.length > 0 && migratedDraft[0]) {
              const result = migratedDraft[0];

              return {
                success: true,
                data: {
                  id: result.id,
                  customerId: result.customerId,
                  sessionId: result.sessionId,
                  draftData: result.draftData,
                  createdAt: result.createdAt,
                  updatedAt: result.updatedAt
                },
                error: null
              };
            }
          }
        }
      } else if (sessionId) {
        // Для анонимных пользователей ищем по sessionId
        existingDraft = await db
          .select()
          .from(checkoutDrafts)
          .where(eq(checkoutDrafts.sessionId, sessionId))
          .limit(1);
      }

      let result;

      if (existingDraft && existingDraft.length > 0 && existingDraft[0]) {
        // Обновляем существующий черновик
        const updatedDraft = await db
          .update(checkoutDrafts)
          .set({
            draftData: {
              ...(typeof existingDraft[0]?.draftData === 'object' && existingDraft[0].draftData !== null ? existingDraft[0].draftData : {}),
              ...validationResult.data, // Используем валидированные данные
            },
            updatedAt: new Date(),
          })
          .where(eq(checkoutDrafts.id, existingDraft[0].id))
          .returning();

        result = updatedDraft[0];
      } else {
        // Создаем новый черновик
        const insertData: any = {
          draftData: validationResult.data, // Используем валидированные данные
        };

        // Добавляем customerId только если он передан
        if (customerId) {
          insertData.customerId = customerId;
        }

        // Добавляем sessionId только если он передан и нет customerId
        if (sessionId && !customerId) {
          insertData.sessionId = sessionId;
        }

        const newDraft = await db
          .insert(checkoutDrafts)
          .values(insertData)
          .returning();

        result = newDraft[0];
      }

      // Проверяем, что result определен
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось сохранить черновик",
        });
      }

      return {
        success: true,
        data: {
          id: result.id,
          customerId: result.customerId,
          sessionId: result.sessionId,
          draftData: result.draftData,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        },
        error: null
      };
    } catch (error) {
      console.error("Ошибка при сохранении черновика:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось сохранить черновик",
      });
    }
  });
