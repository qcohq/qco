/**
 * Утилита для перевода статусов заказов на русский язык
 */

export const orderStatusTranslations: Record<string, string> = {
    // Статусы заказов
    pending: "Ожидает обработки",
    processing: "В обработке",
    payment_pending: "Ожидает оплаты",
    paid: "Оплачен",
    completed: "Завершён",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
    refunded: "Возвращён",
    on_hold: "Приостановлен",
    partially_refunded: "Частично возвращён",
    failed: "Неудачный",

    // Статусы оплаты
    payment_processing: "Оплата обрабатывается",
    payment_completed: "Оплата завершена",
    payment_failed: "Оплата неудачна",
    payment_refunded: "Оплата возвращена",
    payment_partially_refunded: "Частичный возврат",

    // Способа доставки
    standard: "Стандартная доставка",
    express: "Экспресс доставка",
    overnight: "Доставка на следующий день",
    pickup: "Самовывоз",
    international: "Международная доставка",
    free: "Бесплатная доставка",

    // Способы оплаты
    credit_card: "Банковская карта",
    bank_transfer: "Банковский перевод",
    paypal: "PayPal",
    cash_on_delivery: "Наличными при получении",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    crypto: "Криптовалюта",
};

/**
 * Переводит статус заказа на русский язык
 */
export function translateOrderStatus(status: string): string {
    if (!status) return "";
    return orderStatusTranslations[status.toLowerCase()] || status;
}

/**
 * Переводит статус оплаты на русский язык
 */
export function translatePaymentStatus(status: string): string {
    if (!status) return "";
    const key = status.toLowerCase().replace(/\s+/g, '_');
    return orderStatusTranslations[key] || status;
}

/**
 * Переводит способ доставки на русский язык
 */
export function translateShippingMethod(method: string): string {
    if (!method) return "";
    return orderStatusTranslations[method.toLowerCase()] || method;
}

/**
 * Переводит способ оплаты на русский язык
 */
export function translatePaymentMethod(method: string): string {
    if (!method) return "";
    return orderStatusTranslations[method.toLowerCase()] || method;
} 