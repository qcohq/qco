"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import { Separator } from "@qco/ui/components/separator";
import { ArrowRight, Heart, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { formatPrice } from "../utils/price-formatting";
import { CartItemOptions } from "./cart-item-options";
import { CartItemPrice } from "./cart-item-price";
import { Skeleton } from "@qco/ui/components/skeleton";

export default function CartPage() {
  const [promoCode, setPromoCode] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  // Используем хук корзины с tRPC API
  const {
    cart,
    isLoading,
    error,
    subtotal,
    shipping,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    isUpdatingItem,
    isRemovingItem,
  } = useCart();

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Заголовок */}
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Корзина
          </h1>
          <p className="text-muted-foreground">Загрузка корзины...</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Скелетон товаров корзины */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex gap-2 sm:gap-4">
                    <Skeleton className="w-20 h-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Скелетон итогов */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-9 sm:h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">
          Ошибка загрузки корзины: {error.message}
        </p>
        <Button asChild>
          <Link href="/catalog">Перейти к покупкам</Link>
        </Button>
      </div>
    );
  }

  // Показываем пустую корзину
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-6" />
        <h1 className="font-playfair text-3xl font-bold mb-4">
          Ваша корзина пуста
        </h1>
        <p className="text-muted-foreground mb-8">
          Добавьте товары в корзину, чтобы продолжить покупки
        </p>
        <Button asChild size="lg">
          <Link href="/catalog">Перейти к покупкам</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Корзина
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">{itemCount} товар(ов) в корзине</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {[...cart.items]
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((item) => (
              <Card key={item.id} className="p-0">
                <CardContent className="p-2 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="relative w-full max-w-[120px] h-24 sm:w-24 sm:h-32 bg-gray-100 rounded-lg overflow-hidden mx-auto sm:mx-0">
                      <Image
                        src={item.product?.mainImage || "/placeholder.svg"}
                        alt={item.product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1 sm:space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <div>
                          <Link
                            href={`/products/${item.product?.slug}`}
                            className="font-medium hover:underline text-sm sm:text-lg"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {item.product?.brand?.name}
                          </p>
                        </div>
                        <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleFavorite(item.productId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Heart
                              className={`h-4 w-4 ${isFavorite(item.productId) ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isRemovingItem}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <CartItemOptions
                        options={item.options}
                        variant={item.variant ? {
                          ...item.variant,
                          sku: item.variant.sku || '',
                          stock: item.variant.stock ?? 0
                        } : null}
                      />

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center border rounded-lg w-fit">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isUpdatingItem}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 sm:px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={isUpdatingItem}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <CartItemPrice
                          price={item.price}
                          quantity={item.quantity}
                          variant={item.variant ? {
                            ...item.variant,
                            sku: item.variant.sku || '',
                            stock: item.variant.stock ?? 0,
                            salePrice: item.variant.compareAtPrice
                          } : null}
                          product={item.product ? {
                            ...item.product,
                            stock: item.product.stock ?? 0
                          } : null}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="w-full max-w-md mx-auto lg:mx-0 lg:max-w-none lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Итого по заказу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Товары ({itemCount})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground">
                Без учета возможной стоимости доставки
              </p>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="text-sm px-2 py-1 h-9 sm:h-10"
                  />
                  <Button variant="outline" className="h-9 sm:h-10 px-3 text-sm">Применить</Button>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-base sm:text-lg">
                <span>К оплате</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button asChild size="lg" className="w-full h-11 sm:h-12 text-base">
                <Link href="/checkout">
                  Оформить заказ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
