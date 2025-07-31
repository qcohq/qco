import { validateDraftData } from "@qco/web-validators";
import { z } from "zod";

import { publicProcedure } from "../../trpc";

/**
 * Валидация данных черновика оформления заказа
 * Возвращает детальную информацию об ошибках и полноте данных
 */
export const validateDraft = publicProcedure
    .input(
        z.object({
            draftData: z.record(z.any()).optional(),
        })
    )
    .query(async ({ input }) => {
        const { draftData } = input;

        if (!draftData || Object.keys(draftData).length === 0) {
            return {
                success: false,
                error: "Данные для валидации не переданы",
                validation: null,
                completeness: null,
            };
        }

        try {
            // Валидируем данные
            const validationResult = validateDraftData(draftData);

            return {
                success: true,
                data: {
                    isValid: validationResult.isValid,
                    errors: validationResult.errors,
                    recommendations: generateRecommendations(validationResult)
                },
                error: null
            };
        } catch (error) {
            console.error("Ошибка при валидации черновика:", error);

            return {
                success: false,
                error: "Ошибка при валидации данных",
                validation: null,
                completeness: null,
            };
        }
    });

/**
 * Генерирует рекомендации по улучшению данных черновика
 */
function generateRecommendations(validationResult: any) {
    const recommendations: string[] = [];

    // Рекомендации по валидации
    if (!validationResult.isValid && validationResult.errors) {
        // Группируем ошибки по типам для рекомендаций
        const fieldErrors = validationResult.errors.reduce((acc: any, error: any) => {
            const field = error.path[0];
            if (!acc[field]) acc[field] = [];
            acc[field].push(error.message);
            return acc;
        }, {});

        // Добавляем рекомендации на основе ошибок
        if (fieldErrors.email) {
            recommendations.push("Проверьте правильность email адреса");
        }
        if (fieldErrors.phone) {
            recommendations.push("Введите корректный номер телефона");
        }
        if (fieldErrors.postalCode) {
            recommendations.push("Проверьте правильность почтового индекса");
        }
    }

    return recommendations;
} 