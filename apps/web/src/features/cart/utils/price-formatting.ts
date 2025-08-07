/**
 * Безопасно форматирует цену в российских рублях
 * @param price - цена для форматирования
 * @returns отформатированная строка цены
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return "0 ₽";
  }

  const numericPrice =
    typeof price === "string" ? Number.parseFloat(price) : price;

  if (Number.isNaN(numericPrice)) {
    return "0 ₽";
  }

  return `${numericPrice.toLocaleString("ru-RU")} ₽`;
}

/**
 * Безопасно форматирует цену без символа валюты
 * @param price - цена для форматирования
 * @returns отформатированная строка цены без символа валюты
 */
export function formatPriceNumber(
  price: number | string | null | undefined,
): string {
  if (price === null || price === undefined) {
    return "0";
  }

  const numericPrice =
    typeof price === "string" ? Number.parseFloat(price) : price;

  if (Number.isNaN(numericPrice)) {
    return "0";
  }

  return numericPrice.toLocaleString("ru-RU");
}
