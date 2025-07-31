import { createId } from "@paralleldrive/cuid2";

/**
 * Генерирует уникальный идентификатор сессии для анонимных пользователей
 */
export function generateSessionId(): string {
    return `session_${createId()}`;
}

/**
 * Проверяет, является ли sessionId валидным
 */
export function isValidSessionId(sessionId: string): boolean {
    return sessionId.startsWith('session_') && sessionId.length > 20;
}

/**
 * Извлекает sessionId из строки (если он есть)
 */
export function extractSessionId(input: string): string | null {
    if (isValidSessionId(input)) {
        return input;
    }
    return null;
}

/**
 * Создает объект с параметрами для работы с черновиками
 * Автоматически определяет, использовать customerId или sessionId
 */
export function createDraftParams(params: {
    customerId?: string;
    sessionId?: string;
}) {
    const { customerId, sessionId } = params;

    // Если есть customerId, используем его (приоритет авторизованным пользователям)
    if (customerId) {
        return {
            customerId,
            sessionId: undefined, // Не передаем sessionId для авторизованных пользователей
        };
    }

    // Если нет customerId, но есть sessionId, используем его
    if (sessionId) {
        return {
            customerId: undefined,
            sessionId,
        };
    }

    // Если нет ни того, ни другого, генерируем новый sessionId
    return {
        customerId: undefined,
        sessionId: generateSessionId(),
    };
} 