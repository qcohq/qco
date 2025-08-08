import type { Order, OrderItem } from "../types";

/**
 * Форматирует цену для отображения
 */
export function formatPrice(price?: number | null): string {
    if (price === null || price === undefined) {
        return "Цена не указана";
    }
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
    }).format(price);
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("ru-RU");
}

/**
 * Форматирует дату и время для отображения
 */
export function formatDateTime(date: string | Date): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("ru-RU");
}

/**
 * Получает общее количество товаров в заказе
 */
export function getTotalQuantity(order: Order): number {
    return order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
}

/**
 * Получает общую стоимость заказа
 */
export function getTotalAmount(order: Order): number {
    return order.totalAmount || 0;
}

/**
 * Проверяет, оплачен ли заказ
 */
export function isOrderPaid(order: Order): boolean {
    return order.orderStatus !== "Ожидает оплаты" && order.paymentStatus !== "pending";
}

/**
 * Получает статус доставки на основе статуса заказа
 */
export function getDeliveryStatus(orderStatus: string): string {
    switch (orderStatus) {
        case "Ожидает оплаты":
        case "Обработка":
            return "Ожидает отправки";
        case "Отправлен":
            return "В пути";
        case "Доставлен":
            return "Доставлен";
        case "Отменен":
            return "Отменен";
        default:
            return "Неизвестно";
    }
}

/**
 * Получает цвет для статуса заказа
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case "Ожидает оплаты":
            return "text-yellow-600 bg-yellow-50 border-yellow-200";
        case "Обработка":
            return "text-blue-600 bg-blue-50 border-blue-200";
        case "Отправлен":
            return "text-purple-600 bg-purple-50 border-purple-200";
        case "Доставлен":
            return "text-green-600 bg-green-50 border-green-200";
        case "Отменен":
            return "text-red-600 bg-red-50 border-red-200";
        default:
            return "text-gray-600 bg-gray-50 border-gray-200";
    }
}

/**
 * Получает метку для статуса заказа
 */
export function getStatusLabel(status: string): string {
    const normalized = (status || "").toLowerCase();
    const statusLabels: Record<string, string> = {
        // base enum values (lowercase)
        pending: "Ожидает оплаты",
        confirmed: "Подтверждён",
        processing: "В обработке",
        shipped: "Отправлен",
        delivered: "Доставлен",
        cancelled: "Отменён",
        refunded: "Возврат",

        // extra states used in UI mappings (lowercase)
        failed: "Ошибка",
        on_hold: "На удержании",
        partially_refunded: "Частичный возврат",

        // already localized variants (kept lowercase for idempotency)
        "ожидает оплаты": "Ожидает оплаты",
        "подтверждён": "Подтверждён",
        "в обработке": "В обработке",
        "отправлен": "Отправлен",
        "доставлен": "Доставлен",
        "отменён": "Отменён",
        "возврат": "Возврат",
        "ошибка": "Ошибка",
        "на удержании": "На удержании",
        "частичный возврат": "Частичный возврат",
    } as const;

    return statusLabels[normalized] || status;
}

/**
 * Получает метку для способа оплаты
 */
export function getPaymentMethodLabel(method: string): string {
    const methodLabels: Record<string, string> = {
        "card": "Банковская карта",
        "cash": "Наличные",
        "bank_transfer": "Банковский перевод",
        "electronic": "Электронный платеж",
        "Банковская карта": "Банковская карта",
        "Наличные": "Наличные",
        "Банковский перевод": "Банковский перевод",
        "Электронный платеж": "Электронный платеж",
    };
    return methodLabels[method] || method;
}

/**
 * Получает метку для способа доставки
 */
export function getDeliveryMethodLabel(method: string): string {
    const methodLabels: Record<string, string> = {
        "courier": "Курьерская доставка",
        "pickup": "Самовывоз",
        "post": "Почтовая доставка",
        "express": "Экспресс доставка",
        "Курьерская доставка": "Курьерская доставка",
        "Самовывоз": "Самовывоз",
        "Почтовая доставка": "Почтовая доставка",
        "Экспресс доставка": "Экспресс доставка",
    };
    return methodLabels[method] || method;
}

/**
 * Получает инициалы клиента
 */
export function getCustomerInitials(customerName: string): string {
    const names = customerName.split(" ");
    if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return customerName.substring(0, 2).toUpperCase();
}

/**
 * Получает полное имя клиента
 */
export function getCustomerName(order: Order): string {
    const firstName = order.metadata?.customerInfo?.firstName || "";
    const lastName = order.metadata?.customerInfo?.lastName || "";
    return `${firstName} ${lastName}`.trim() || order.customerName || "Неизвестный клиент";
}

/**
 * Получает email клиента
 */
export function getCustomerEmail(order: Order): string | null {
    return order.metadata?.customerInfo?.email || null;
}

/**
 * Получает телефон клиента
 */
export function getCustomerPhone(order: Order): string | null {
    return order.metadata?.customerInfo?.phone || null;
}

/**
 * Получает адрес доставки
 */
export function getShippingAddress(order: Order): string | null {
    if (!order.shippingAddress) return null;

    const { street, city, postalCode, country } = order.shippingAddress;
    return `${street}, ${city}, ${postalCode}, ${country}`;
}

/**
 * Фильтрует заказы по статусу
 */
export function filterOrdersByStatus(
    orders: Order[],
    status: string
): Order[] {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
}

/**
 * Фильтрует заказы по дате
 */
export function filterOrdersByDate(
    orders: Order[],
    dateFrom?: string,
    dateTo?: string
): Order[] {
    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const fromDate = dateFrom ? new Date(dateFrom) : null;
        const toDate = dateTo ? new Date(dateTo) : null;

        if (fromDate && orderDate < fromDate) return false;
        if (toDate && orderDate > toDate) return false;
        return true;
    });
}

/**
 * Сортирует заказы по дате
 */
export function sortOrdersByDate(
    orders: Order[],
    ascending = false
): Order[] {
    return [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
}

/**
 * Сортирует заказы по сумме
 */
export function sortOrdersByAmount(
    orders: Order[],
    ascending = false
): Order[] {
    return [...orders].sort((a, b) => {
        const amountA = getTotalAmount(a);
        const amountB = getTotalAmount(b);
        return ascending ? amountA - amountB : amountB - amountA;
    });
}

/**
 * Поиск заказов по тексту
 */
export function searchOrders(
    orders: Order[],
    searchText: string
): Order[] {
    if (!searchText) return orders;

    const searchLower = searchText.toLowerCase();
    return orders.filter(order => {
        const orderNumber = order.orderNumber || order.orderId;
        const customerName = getCustomerName(order);

        return (
            orderNumber.toLowerCase().includes(searchLower) ||
            customerName.toLowerCase().includes(searchLower) ||
            order.customerId?.toLowerCase().includes(searchLower)
        );
    });
}

/**
 * Валидирует данные заказа
 */
export function validateOrderData(order: Partial<Order>): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!order.customerName && !order.metadata?.customerInfo) {
        errors.push("Не указан клиент");
    }

    if (!order.items || order.items.length === 0) {
        errors.push("Заказ должен содержать хотя бы один товар");
    }

    if (order.totalAmount !== undefined && order.totalAmount < 0) {
        errors.push("Сумма заказа не может быть отрицательной");
    }

    if (order.items) {
        order.items.forEach((item, index) => {
            if (item.quantity <= 0) {
                errors.push(`Товар ${index + 1}: количество должно быть больше 0`);
            }
            if (item.price < 0) {
                errors.push(`Товар ${index + 1}: цена не может быть отрицательной`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
} 