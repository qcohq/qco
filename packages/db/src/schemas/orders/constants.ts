export const OrderStatus = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
} as const;

export const PaymentStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
    PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
    CREDIT_CARD: "credit_card",
    BANK_TRANSFER: "bank_transfer",
    CASH_ON_DELIVERY: "cash_on_delivery",
    DIGITAL_WALLET: "digital_wallet",
} as const;

export const ShippingMethod = {
    STANDARD: "standard",
    EXPRESS: "express",
    PICKUP: "pickup",
    SAME_DAY: "same_day",
} as const;


// Маппинг статусов заказа на русский язык (только существующие в БД)
export const ORDER_STATUS_LABELS: Record<string, string> = {
    [OrderStatus.PENDING]: "В ожидании",
    [OrderStatus.CONFIRMED]: "Подтверждён",
    [OrderStatus.PROCESSING]: "В обработке",
    [OrderStatus.SHIPPED]: "Отправлен",
    [OrderStatus.DELIVERED]: "Доставлен",
    [OrderStatus.CANCELLED]: "Отменён",
    [OrderStatus.REFUNDED]: "Возврат",
    // Дополнительные возможные значения, встречающиеся в UI
    completed: "Завершён",
    failed: "Ошибка",
    on_hold: "На удержании",
    partially_refunded: "Частичный возврат",
} as const;

/**
 * Преобразует код статуса заказа в русский текст
 * @param status - Код статуса заказа
 * @returns Русский текст статуса или исходный код, если перевод не найден
 */
export const getOrderStatusLabel = (status: string): string => {
    return ORDER_STATUS_LABELS[status] || status;
};

/**
 * Получает все доступные статусы заказа с их русскими названиями
 * @returns Массив объектов с кодом и названием статуса
 */
export const getOrderStatusOptions = () => {
    return Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
    }));
}; 