"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { FormControl, FormItem, FormLabel } from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import type { OrderItemInput } from "@qco/validators";
import { HelpCircle, Plus, X } from "lucide-react";
import { useState } from "react";

// TODO: Использовать тип из схемы пропсов добавления элемента заказа, если появится в @qco/validators
interface OrderItemAddProps {
  onAdd: (item: OrderItemInput) => void;
}

export function OrderItemAdd({ onAdd }: OrderItemAddProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<OrderItemInput>>({
    name: "",
    sku: "",
    price: "0.00",
    quantity: 1,
    totalPrice: "0.00",
    discountedPrice: "",
  });

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) {
      return;
    }

    const item: OrderItemInput = {
      name: newItem.name,
      sku: newItem.sku || null,
      price: newItem.price,
      quantity: newItem.quantity || 1,
      totalPrice: newItem.totalPrice || "0.00",
      discountedPrice: newItem.discountedPrice || null,
      productId: null,
      variantId: null,
      attributes: {},
      metadata: {},
    };

    onAdd(item);
    setIsAdding(false);
    setNewItem({
      name: "",
      sku: "",
      price: "0.00",
      quantity: 1,
      totalPrice: "0.00",
      discountedPrice: "",
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewItem({
      name: "",
      sku: "",
      price: "0.00",
      quantity: 1,
      totalPrice: "0.00",
      discountedPrice: "",
    });
  };

  const calculateTotal = (price: string, quantity: number) => {
    const priceNum = Number.parseFloat(price) || 0;
    return (priceNum * quantity).toFixed(2);
  };

  const handleQuantityChange = (quantity: number) => {
    const totalPrice = calculateTotal(newItem.price || "0", quantity);
    setNewItem((prev) => ({
      ...prev,
      quantity,
      totalPrice,
    }));
  };

  const handlePriceChange = (price: string) => {
    const totalPrice = calculateTotal(price, newItem.quantity || 1);
    setNewItem((prev) => ({
      ...prev,
      price,
      totalPrice,
    }));
  };

  if (!isAdding) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsAdding(true)}
        className="w-full h-20 border-dashed border-2 hover:border-solid"
      >
        <Plus className="h-4 w-4 mr-2" />
        Добавить товар
      </Button>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Новый товар</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAdd}
              className="flex items-center gap-1"
              disabled={!newItem.name || !newItem.price}
            >
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Отмена
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormItem>
            <FormLabel>Название товара *</FormLabel>
            <FormControl>
              <Input
                value={newItem.name}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Введите название товара"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <Input
                value={newItem.sku || ""}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, sku: e.target.value }))
                }
                placeholder="Введите SKU"
              />
            </FormControl>
          </FormItem>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormItem>
            <FormLabel>Цена *</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                value={newItem.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0.00"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Количество</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) =>
                  handleQuantityChange(Number.parseInt(e.target.value) || 1)
                }
                placeholder="1"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Итого</FormLabel>
            <FormControl>
              <Input value={newItem.totalPrice} disabled placeholder="0.00" />
            </FormControl>
          </FormItem>
        </div>

        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>Цена со скидкой</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Специальная цена со скидкой. Если указана, то именно она
                    будет показана покупателям вместо базовой цены
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              value={newItem.discountedPrice || ""}
              onChange={(e) =>
                setNewItem((prev) => ({
                  ...prev,
                  discountedPrice: e.target.value,
                }))
              }
              placeholder="0.00"
            />
          </FormControl>
        </FormItem>
      </CardContent>
    </Card>
  );
}
