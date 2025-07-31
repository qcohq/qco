import { type CheckoutDraftPartialValues, DraftValidationResult } from "@qco/web-validators";

/**
 * Объединяет частичные данные черновика с существующими данными
 */
export function mergeDraftData(
    existingData: CheckoutDraftPartialValues | null,
    newData: CheckoutDraftPartialValues
): CheckoutDraftPartialValues {
    if (!existingData) {
        return newData;
    }

    return {
        ...existingData,
        ...newData,
    };
}

/**
 * Проверяет, есть ли изменения в данных
 */
export function hasDraftChanges(
    originalData: CheckoutDraftPartialValues | null,
    currentData: CheckoutDraftPartialValues
): boolean {
    if (!originalData) {
        return Object.keys(currentData).length > 0;
    }

    // Сравниваем каждое поле
    for (const [key, value] of Object.entries(currentData)) {
        if (originalData[key as keyof CheckoutDraftPartialValues] !== value) {
            return true;
        }
    }

    return false;
}

/**
 * Очищает пустые значения из данных черновика
 */
export function cleanDraftData(data: CheckoutDraftPartialValues): CheckoutDraftPartialValues {
    const cleaned: CheckoutDraftPartialValues = {};

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key as keyof CheckoutDraftPartialValues] = value;
        }
    }

    return cleaned;
}

/**
 * Создает объект с только измененными полями
 */
export function getChangedFields(
    originalData: CheckoutDraftPartialValues | null,
    currentData: CheckoutDraftPartialValues
): CheckoutDraftPartialValues {
    if (!originalData) {
        return currentData;
    }

    const changed: CheckoutDraftPartialValues = {};

    for (const [key, value] of Object.entries(currentData)) {
        const originalValue = originalData[key as keyof CheckoutDraftPartialValues];
        if (originalValue !== value) {
            changed[key as keyof CheckoutDraftPartialValues] = value;
        }
    }

    return changed;
}

/**
 * Группирует ошибки валидации по категориям для лучшего UX
 */
export function groupValidationErrors(errors: any[] | null) {
    if (!errors) return {};

    const groups = {
        contact: [] as string[],
        shipping: [] as string[],
        payment: [] as string[],
        general: [] as string[]
    };

    errors.forEach(error => {
        const field = error.path[0];
        const message = error.message;

        if (['firstName', 'lastName', 'email', 'phone'].includes(field)) {
            groups.contact.push(message);
        } else if (['address', 'apartment', 'city', 'state', 'postalCode'].includes(field)) {
            groups.shipping.push(message);
        } else if (['shippingMethod', 'paymentMethod'].includes(field)) {
            groups.payment.push(message);
        } else {
            groups.general.push(message);
        }
    });

    return groups;
}

/**
 * Проверяет наличие критических ошибок
 */
export function hasCriticalErrors(errors: any[] | null): boolean {
    if (!errors) return false;

    const criticalFields = ['email', 'phone', 'address', 'city'];
    return errors.some(error => criticalFields.includes(error.path[0]));
}

/**
 * Подготавливает данные для автосохранения
 */
export function prepareAutoSaveData(data: CheckoutDraftPartialValues): CheckoutDraftPartialValues {
    return cleanDraftData(data);
}

/**
 * Определяет, нужно ли показывать предупреждение о несохраненных изменениях
 */
export function shouldShowUnsavedWarning(
    originalData: CheckoutDraftPartialValues | null,
    currentData: CheckoutDraftPartialValues,
    isDirty: boolean
): boolean {
    return isDirty && hasDraftChanges(originalData, currentData);
} 