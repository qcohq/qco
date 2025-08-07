"use client";

import { Button } from "@qco/ui/components/button";
import { Separator } from "@qco/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@qco/ui/components/sheet";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const cartItems = [
  {
    id: "1",
    name: "Элегантное черное платье",
    brand: "CHANEL",
    price: 89000,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=80",
    size: "M",
  },
  {
    id: "2",
    name: "Кожаная сумка",
    brand: "HERMÈS",
    price: 156000,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=80",
  },
];

export default function CartDropdown() {
  const [items, setItems] = useState(cartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Корзина ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Ваша корзина пуста</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.brand}</p>
                        {item.size && (
                          <p className="text-xs text-gray-500">
                            Размер: {item.size}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {(item.price * item.quantity).toLocaleString(
                              "ru-RU",
                            )}{" "}
                            ₽
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Итого:</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                  <Button variant="outline" className="w-full">
                    Перейти в корзину
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
