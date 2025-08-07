"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import { useTRPC } from "@/trpc/react";
import { calculateActualPrice, formatPrice } from "../utils/price-calculator";

interface OrderSummaryProps {
  form: UseFormReturn<any>;
  cart: any;
  isCreatingOrder: boolean;
  mobileFlat?: boolean;
}

export function OrderSummary({
  form,
  cart,
  isCreatingOrder,
  mobileFlat = false,
}: OrderSummaryProps) {
  const trpc = useTRPC();

  // Получаем настройки доставки
  const deliverySettingsQueryOptions =
    trpc.deliverySettings.getAll.queryOptions();
  const { data: deliverySettings } = useQuery(deliverySettingsQueryOptions);

  // Используем total с сервера, который уже правильно вычислен с приоритетом salePrice
  const subtotal = cart?.total || 0;

  const selectedMethodId = form.watch("shippingMethod");
  const selectedShippingMethod = deliverySettings?.find(
    (setting: any) => setting.id === selectedMethodId,
  );

  const calculateDeliveryCost = (setting: any) => {
    if (!setting) return 0;
    const cost = Number.parseFloat(setting.deliveryCost || "0");
    const threshold = Number.parseFloat(setting.freeDeliveryThreshold || "0");

    if (threshold > 0 && subtotal >= threshold) {
      return 0;
    }

    return cost;
  };

  const shippingCost = calculateDeliveryCost(selectedShippingMethod);
  const total = subtotal + shippingCost;

  return (
    <Card className={mobileFlat ? "border-0 rounded-none shadow-none p-0 sticky:static" : "sticky top-4"}>
      <CardHeader>
        <CardTitle>Ваш заказ</CardTitle>
        <CardDescription>Проверьте детали заказа</CardDescription>
      </CardHeader>
      <CardContent className={mobileFlat ? "px-0 space-y-4" : "space-y-4"}>
        {/* Order Items */}
        <div className="space-y-3">
          {cart?.items.map((item: any) => {
            const { actualPrice, comparePrice } = calculateActualPrice(item);
            const totalPrice = actualPrice * item.quantity;

            return (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="relative w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      item.product?.mainImage ||
                      "/placeholder.svg?height=64&width=48"
                    }
                    alt={item.product?.name || "Товар"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.product?.name || "Товар"}
                  </h4>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">
                      Вариант: {item.variant.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Количество: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-sm">
                    {formatPrice(totalPrice)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(actualPrice)} за шт.
                  </p>
                  {comparePrice && comparePrice > actualPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                      {formatPrice(comparePrice)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Товары ({cart?.itemCount || 0} шт.)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Доставка</span>
            <span>
              {shippingCost === 0 ? "Бесплатно" : formatPrice(shippingCost)}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Итого к оплате</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Создание заказа...
            </>
          ) : (
            "Оформить заказ"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
