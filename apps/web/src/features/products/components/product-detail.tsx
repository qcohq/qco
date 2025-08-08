"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Separator } from "@qco/ui/components/separator";
import { Loader2, RotateCcw, Share2, Shield, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { useAddToCart } from "../hooks/use-add-to-cart";
import { useProductAttributes } from "../hooks/use-product-attributes";
import ProductImageGallery from "./product-image-gallery";
import ProductSpecifications from "./product-specifications";
import RelatedProducts from "./related-products";
import SizeGuide from "./size-guide";
import { BrandLink } from "./brand-link";
import type { ProductDetail } from "@qco/web-validators";

interface ProductDetailProps {
  product: ProductDetail;
  slug?: string;
}

export default function ProductDetail({ product, slug }: ProductDetailProps) {
  const { attributes, isLoading: isAttributesLoading } = useProductAttributes(slug);
  const { addToCart, isPending } = useAddToCart();

  // Все хуки useState должны быть в начале компонента
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductDetail['variants'][0] | null>(null);

  // Инициализация при загрузке продукта
  useEffect(() => {
    if (!product) return;

    // Инициализируем selectedVariant
    const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0] || null;
    setSelectedVariant(defaultVariant);

    // Автоматически выбираем цвет, если он единственный
    if (product.colors.length === 1) {
      const color = product.colors[0];
      const colorName = typeof color === "string" ? color : color.name;
      setSelectedColor(colorName);
    }

    // Автоматически выбираем размер, если он единственный и в наличии
    if (product.sizes.length === 1) {
      const size = product.sizes[0];
      const sizeValue = typeof size === "string" ? size : size.value;
      const inStock = typeof size === "string" ? true : size.inStock;

      if (inStock) {
        setSelectedSize(sizeValue);
      }
    }
  }, [product?.id]); // Зависимость только от ID продукта

  // Автоматический выбор варианта на основе выбранных цвета и размера
  useEffect(() => {
    if (!product || !selectedColor && !selectedSize) return;

    // Ищем вариант, который соответствует выбранным атрибутам
    const findMatchingVariant = () => {
      return product.variants.find((variant) => {
        if (!variant.options) return false;

        let matchesColor = true;
        let matchesSize = true;

        // Проверяем цвет, если он выбран
        if (selectedColor) {
          matchesColor = variant.options.some((attr) => {
            const optionName = attr.option.toLowerCase();
            const attrValue = attr.value.toLowerCase();
            const selectedColorLower = selectedColor.toLowerCase();

            // Универсальная проверка для цветов (любое название атрибута, связанное с цветом)
            const isColorAttribute =
              optionName.includes("цвет") || optionName.includes("color");
            return isColorAttribute && attrValue === selectedColorLower;
          });
        }

        // Проверяем размер, если он выбран
        if (selectedSize) {
          matchesSize = variant.options.some((attr) => {
            const optionName = attr.option.toLowerCase();
            const attrValue = attr.value.toLowerCase();
            const selectedSizeLower = selectedSize.toLowerCase();

            // Универсальная проверка для размеров (любое название атрибута, связанное с размером)
            const isSizeAttribute =
              optionName.includes("размер") || optionName.includes("size");
            return isSizeAttribute && attrValue === selectedSizeLower;
          });
        }

        return matchesColor && matchesSize;
      });
    };

    const matchingVariant = findMatchingVariant();

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    } else if (selectedColor || selectedSize) {
      // Если не нашли точное совпадение, но есть выбранные атрибуты,
      // ищем вариант с частичным совпадением
      const partialMatch = product.variants.find((variant) => {
        if (!variant.options) return false;

        return variant.options.some((attr) => {
          const optionName = attr.option.toLowerCase();
          const attrValue = attr.value.toLowerCase();

          if (selectedColor) {
            const isColorAttribute =
              optionName.includes("цвет") || optionName.includes("color");
            return (
              isColorAttribute && attrValue === selectedColor.toLowerCase()
            );
          }
          if (selectedSize) {
            const isSizeAttribute =
              optionName.includes("размер") || optionName.includes("size");
            return isSizeAttribute && attrValue === selectedSize.toLowerCase();
          }
          return false;
        });
      });

      if (partialMatch) {
        setSelectedVariant(partialMatch);
      }
    }
  }, [selectedColor, selectedSize, product?.variants]);

  if (isAttributesLoading) {
    return <div>Загрузка...</div>;
  }

  if (!product) {
    return <div>Ошибка загрузки продукта</div>;
  }

  // Логика цен: приоритет у варианта, затем salePrice, затем basePrice
  const currentPrice = selectedVariant
    ? selectedVariant.salePrice || selectedVariant.price
    : product.salePrice || product.basePrice || 0;

  const originalPrice = selectedVariant ? selectedVariant.price : product.basePrice;
  // Рассчитываем скидку
  const discountPercentage =
    originalPrice && currentPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // Получаем URL изображений для галереи
  const imageUrls = product.images.map((img) => img.url);




  return (
    <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
      {/* Галерея изображений */}
      <div>
        <ProductImageGallery images={imageUrls} productName={product.name} />
      </div>

      {/* Информация о товаре */}
      <div className="space-y-4 sm:space-y-6">
        {/* Заголовок и цена */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            {product.isNew && (
              <Badge className="bg-black text-white text-xs sm:text-sm">
                Новинка
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs sm:text-sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          <div>
            <p className="text-muted-foreground mb-1 sm:mb-2 text-sm sm:text-base">
              <BrandLink
                brandName={product.brand}
                brandSlug={product.brandSlug}
              />
            </p>
            <h1 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold">
                {currentPrice.toLocaleString("ru-RU")} ₽
              </span>
              {originalPrice && originalPrice > currentPrice && (
                <span className="text-base sm:text-lg text-muted-foreground line-through">
                  {originalPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Выбор цвета */}
        {product.colors.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-medium text-sm sm:text-base">
              Цвет: {selectedColor || "Выберите цвет"}
            </h3>
            <div className="flex gap-2">
              {product.colors.map((color) => {
                const colorName =
                  typeof color === "string" ? color : color.name;
                const colorHex =
                  typeof color === "string"
                    ? "#000000"
                    : color.hex || "#000000";

                return (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColor(colorName)}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${selectedColor === colorName ? "border-black" : "border-gray-300"}`}
                    style={{ backgroundColor: colorHex }}
                    title={colorName}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Выбор размера */}
        {product.sizes.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm sm:text-base">
                Размер: {selectedSize || "Выберите размер"}
              </h3>
              <SizeGuide />
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((size) => {
                const sizeName = typeof size === "string" ? size : size.name;
                const sizeValue = typeof size === "string" ? size : size.value;
                const inStock = typeof size === "string" ? true : size.inStock;

                return (
                  <button
                    key={sizeValue}
                    onClick={() => setSelectedSize(sizeValue)}
                    disabled={!inStock}
                    className={`py-2 px-2 sm:px-4 border rounded-md text-xs sm:text-sm font-medium transition-colors ${selectedSize === sizeValue
                      ? "border-black bg-black text-white"
                      : inStock
                        ? "border-gray-300 hover:border-gray-400"
                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {sizeName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Добавление в корзину */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex gap-2 sm:gap-3">
            <Button
              size="lg"
              className="flex-1 text-sm sm:text-base h-12 sm:h-14"
              disabled={
                isPending ||
                (product.colors.length > 0 && !selectedColor) ||
                (product.sizes.length > 0 && !selectedSize)
              }
              onClick={() =>
                addToCart({
                  productId: product.id,
                  variantId: selectedVariant?.id,
                  quantity: 1,
                  attributes: {
                    size: selectedSize,
                    color: selectedColor,
                  },
                })
              }
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                "Добавить в корзину"
              )}
            </Button>
            <FavoriteButton
              productId={product.id}
              productName={product.name}
              productPrice={currentPrice}
              productImage={product.image || product.images[0]?.url}
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 w-12 sm:w-14 p-0"
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 w-12 sm:w-14 p-0"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Описание */}
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-semibold">Описание</h2>
          <div className="prose max-w-none">
            <div
              className="text-muted-foreground leading-relaxed text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: product.description || "" }}
            />
          </div>
        </div>

        <Separator />

        {/* Характеристики */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-base sm:text-lg font-semibold">Характеристики</h2>
          {/* Спецификации продукта */}
          <ProductSpecifications
            specifications={product.attributes}
            attributes={attributes}
          />

          {/* Дополнительные характеристики */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-medium text-sm sm:text-base">
                Дополнительная информация
              </h3>
              {product.features.map((detail: string, index: number) => (
                <div
                  key={index}
                  className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm sm:text-base"
                >
                  <span className="text-muted-foreground">
                    {detail.split(":")[0]}:
                  </span>
                  <span className="font-medium">{detail.split(":")[1]}</span>
                </div>
              ))}
            </div>
          )}

          {(!product.attributes || Object.keys(product.attributes).length === 0) &&
            (!product.features || product.features.length === 0) &&
            (!attributes || attributes.length === 0) && (
              <p className="text-muted-foreground text-sm sm:text-base">
                Характеристики не указаны
              </p>
            )}
        </div>

        {/* Преимущества */}
        <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            <span>Бесплатная доставка от 10 000 ₽</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            <span>Возврат в течение 30 дней</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            <span>Гарантия подлинности</span>
          </div>
        </div>
      </div>

      {/* Блок подробной информации перенесён выше, под кнопкой добавления в корзину */}

      {/* Связанные продукты */}
      {product.relatedProducts.length > 0 && (
        <div className="lg:col-span-2 mt-8 sm:mt-12">
          <RelatedProducts products={product.relatedProducts} />
        </div>
      )}
    </div>
  );
}
