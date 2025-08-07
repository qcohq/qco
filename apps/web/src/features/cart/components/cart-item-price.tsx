"use client";

interface CartItemPriceProps {
  price: number | string;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number | string;
    compareAtPrice: number | string | null;
    salePrice: number | string | null;
    stock: number;
    isDefault: boolean;
  } | null;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    basePrice: number | string | null;
    salePrice: number | string | null;
    discountPercent: number | null;
    stock: number;
    mainImage: string | null;
    brand: { name: string; slug: string } | null;
  } | null;
}

export function CartItemPrice({
  price,
  quantity,
  variant,
  product,
}: CartItemPriceProps) {
  // Определяем актуальную цену с правильным приоритетом
  let actualPrice = 0;
  let comparePrice: number | null = null;

  if (variant) {
    // Если есть вариант, используем его цену с приоритетом salePrice
    const variantSalePrice =
      typeof variant.salePrice === "string"
        ? Number.parseFloat(variant.salePrice)
        : variant.salePrice;
    const variantPrice =
      typeof variant.price === "string"
        ? Number.parseFloat(variant.price)
        : variant.price;

    if (variantSalePrice && variantSalePrice > 0) {
      actualPrice = variantSalePrice;
      // Если есть compareAtPrice, используем его как старую цену
      if (variant.compareAtPrice) {
        const compareAtPrice =
          typeof variant.compareAtPrice === "string"
            ? Number.parseFloat(variant.compareAtPrice)
            : variant.compareAtPrice;
        comparePrice = Number.isNaN(compareAtPrice) ? null : compareAtPrice;
      } else if (variantPrice && variantPrice > variantSalePrice) {
        // Если нет compareAtPrice, но есть обычная цена выше salePrice, используем её как старую цену
        comparePrice = variantPrice;
      }
    } else if (variantPrice && variantPrice > 0) {
      actualPrice = variantPrice;
      // Если есть compareAtPrice, используем его как старую цену
      if (variant.compareAtPrice) {
        const compareAtPrice =
          typeof variant.compareAtPrice === "string"
            ? Number.parseFloat(variant.compareAtPrice)
            : variant.compareAtPrice;
        comparePrice = Number.isNaN(compareAtPrice) ? null : compareAtPrice;
      }
    } else {
      // Если у варианта нет цены, используем цену продукта
      const productSalePrice =
        typeof product?.salePrice === "string"
          ? Number.parseFloat(product.salePrice)
          : product?.salePrice;
      const productBasePrice =
        typeof product?.basePrice === "string"
          ? Number.parseFloat(product.basePrice)
          : product?.basePrice;

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
      typeof product?.salePrice === "string"
        ? Number.parseFloat(product.salePrice)
        : product?.salePrice;
    const productBasePrice =
      typeof product?.basePrice === "string"
        ? Number.parseFloat(product.basePrice)
        : product?.basePrice;

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
        typeof price === "string" ? Number.parseFloat(price) : price;
      actualPrice = Number.isNaN(basePrice) ? 0 : basePrice;
    }
  }

  const totalPrice = actualPrice * quantity;

  // Проверяем, что цены валидны перед форматированием
  const formatPrice = (price: number): string => {
    if (Number.isNaN(price) || price === null || price === undefined) {
      return "0 ₽";
    }
    return `${price.toLocaleString("ru-RU")} ₽`;
  };

  return (
    <div className="text-right">
      <p className="font-semibold">{formatPrice(totalPrice)}</p>
      <p className="text-sm text-muted-foreground">
        {formatPrice(actualPrice)} за шт.
      </p>
      {comparePrice && comparePrice > actualPrice && (
        <p className="text-xs text-muted-foreground line-through">
          {formatPrice(comparePrice)}
        </p>
      )}
    </div>
  );
}
