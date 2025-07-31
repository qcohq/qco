/**
 * Утилиты для безопасной работы с массивами в API
 * Предотвращают ошибки при работе с undefined/null значениями
 */

/**
 * Безопасно получает массив, возвращая пустой массив если значение undefined/null
 */
export function safeArray<T>(value: T[] | undefined | null): T[] {
    return value || [];
}

/**
 * Безопасно выполняет map операцию на массиве
 */
export function safeMap<T, R>(
    array: T[] | undefined | null,
    mapper: (item: T, index: number) => R
): R[] {
    return safeArray(array).map(mapper);
}

/**
 * Безопасно получает длину массива
 */
export function safeLength<T>(array: T[] | undefined | null): number {
    return safeArray(array).length;
}

/**
 * Безопасно проверяет, пуст ли массив
 */
export function safeIsEmpty<T>(array: T[] | undefined | null): boolean {
    return safeArray(array).length === 0;
} 
