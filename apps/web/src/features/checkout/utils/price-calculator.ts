/**
 * Утилиты для вычисления цен в checkout с приоритетом salePrice у вариантов
 */

export interface PriceCalculationResult {
  actualPrice: number;
  comparePrice: number | null;
}

/**
 * Вычисляет актуальную цену товара с приоритетом salePrice у вариантов
 */
export function calculateActualPrice(item: any): PriceCalculationResult {
  let actualPrice = 0;
  let comparePrice: number | null = null;

  if (item.variant) {
    // Если есть вариант, используем его цену с приоритетом salePrice
    const variantSalePrice =
      typeof item.variant.salePrice === "string"
        ? Number.parseFloat(item.variant.salePrice)
        : item.variant.salePrice;
    const variantPrice =
      typeof item.variant.price === "string"
        ? Number.parseFloat(item.variant.price)
        : item.variant.price;

    if (variantSalePrice && variantSalePrice > 0) {
      actualPrice = variantSalePrice;
      // Если есть обычная цена выше salePrice, используем её как старую цену
      if (variantPrice && variantPrice > variantSalePrice) {
        comparePrice = variantPrice;
      }
    } else if (variantPrice && variantPrice > 0) {
      actualPrice = variantPrice;
    } else {
      // Если у варианта нет цены, используем цену продукта
      const productSalePrice =
        typeof item.product?.salePrice === "string"
          ? Number.parseFloat(item.product.salePrice)
          : item.product?.salePrice;
      const productBasePrice =
        typeof item.product?.basePrice === "string"
          ? Number.parseFloat(item.product.basePrice)
          : item.product?.basePrice;

      if (productSalePrice && productSalePrice > 0) {
        actualPrice = productSalePrice;
        if (productBasePrice && productBasePrice > productSalePrice) {
          comparePrice = productBasePrice;
        }
      } else if (productBasePrice && productBasePrice > 0) {
        actualPrice = productBasePrice;
      }
    }
  } else {
    // Если нет варианта, используем цену продукта с приоритетом salePrice
    const productSalePrice =
      typeof item.product?.salePrice === "string"
        ? Number.parseFloat(item.product.salePrice)
        : item.product?.salePrice;
    const productBasePrice =
      typeof item.product?.basePrice === "string"
        ? Number.parseFloat(item.product.basePrice)
        : item.product?.basePrice;

    if (productSalePrice && productSalePrice > 0) {
      actualPrice = productSalePrice;
      if (productBasePrice && productBasePrice > productSalePrice) {
        comparePrice = productBasePrice;
      }
    } else if (productBasePrice && productBasePrice > 0) {
      actualPrice = productBasePrice;
    } else {
      // Если нет цен продукта, используем сохраненную цену
      const basePrice =
        typeof item.price === "string"
          ? Number.parseFloat(item.price)
          : item.price;
      actualPrice = isNaN(basePrice) ? 0 : basePrice;
    }
  }

  return { actualPrice, comparePrice };
}

/**
 * Вычисляет только актуальную цену без comparePrice
 */
export function calculateActualPriceOnly(item: any): number {
  const { actualPrice } = calculateActualPrice(item);
  return actualPrice;
}

/**
 * Вычисляет общую стоимость корзины с правильным приоритетом цен
 */
export function calculateCartSubtotal(cart: any): number {
  if (!cart?.items) return 0;

  return cart.items.reduce((sum: number, item: any) => {
    const actualPrice = calculateActualPriceOnly(item);
    return sum + actualPrice * item.quantity;
  }, 0);
}

/**
 * Форматирует цену в российских рублях
 */
export function formatPrice(price: number): string {
  if (isNaN(price) || price === null || price === undefined) {
    return "0 ₽";
  }
  return `${price.toLocaleString("ru-RU")} ₽`;
}
