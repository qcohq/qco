"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { cn } from "@qco/ui/lib/utils";
import { ChevronDown, ChevronRight, ChevronUp, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteOrderButton } from "./delete-order-button";
import { OrderSelection } from "./order-selection";
import type { Order } from "@qco/validators";

// TODO: Использовать тип из схемы пропсов компактной таблицы заказов, если появится в @qco/validators
interface CompactOrderTableProps {
  orders: Order[];
  selectedOrderIds: string[];
  onSelectionChange: (orderId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function CompactOrderTable({
  orders,
  selectedOrderIds,
  onSelectionChange,
  disabled = false,
}: CompactOrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Заказы не найдены.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <OrderRow
          key={order.id}
          order={order}
          isSelected={selectedOrderIds.includes(order.id)}
          onSelectionChange={onSelectionChange}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// Helper function to get product name from SKU
function getProductNameFromSku(sku: string): string {
  // Map of SKUs to product names
  const productMap: Record<string, string> = {
    "MJ-SLIM-001": "Мужские зауженные джинсы",
    "WB-LEATHER-001": "Женские кожаные ботинки",
    "MT-PRINT-001": "Мужская футболка с принтом",
    "WD-SUMMER-001": "Женское летнее платье",
    "KS-CASUAL-001": "Детские кроссовки",
    "MJ-WINTER-001": "Мужской пуховик",
    "WJ-SKINNY-001": "Женские джинсы скинни",
    "MS-RUNNING-001": "Мужские кроссовки для бега",
    "KH-CASUAL-001": "Детская толстовка с капюшоном",
    "WS-HEELS-001": "Женские туфли на каблуке",
    "MS-CHECK-001": "Мужская рубашка в клетку",
    "WA-BAG-001": "Женская сумка через плечо",
    "KO-WINTER-001": "Детский комбинезон",
    "MS-CLASSIC-001": "Мужские классические туфли",
    "WB-CASUAL-001": "Женская блузка",
  };

  return productMap[sku] || `Товар (${sku})`;
}

// Helper function to get sample product colors based on SKU
function getSampleColorFromSku(sku: string): string {
  // First character of SKU determines product type
  const firstChar = sku.charAt(0);

  // Simple mapping for demo purposes
  const colorMap: Record<string, string[]> = {
    M: ["Черный", "Синий", "Серый", "Белый", "Зеленый"],
    W: ["Черный", "Бежевый", "Красный", "Белый", "Розовый"],
    K: ["Синий", "Красный", "Зеленый", "Желтый", "Розовый"],
  };

  const colors = colorMap[firstChar] || ["Черный", "Белый", "Синий"];
  return colors[Math.floor(Math.random() * colors.length)] || "Черный";
}

// Helper function to get sample product sizes based on SKU
function getSampleSizeFromSku(sku: string): string {
  // First character of SKU determines product type
  const firstChar = sku.charAt(0);
  const secondChar = sku.charAt(1);

  // Simple mapping for demo purposes
  if (firstChar === "M") {
    if (secondChar === "S") {
      const sizes = ["40", "41", "42", "43", "44"];
      return sizes[Math.floor(Math.random() * sizes.length)] || "42";
    }
    const sizes = ["S", "M", "L", "XL", "XXL"];
    return sizes[Math.floor(Math.random() * sizes.length)] || "M";
  }
  if (firstChar === "W") {
    if (secondChar === "S") {
      const sizes = ["36", "37", "38", "39", "40"];
      return sizes[Math.floor(Math.random() * sizes.length)] || "38";
    }
    const sizes = ["XS", "S", "M", "L", "XL"];
    return sizes[Math.floor(Math.random() * sizes.length)] || "M";
  }
  if (firstChar === "K") {
    if (secondChar === "S") {
      const sizes = ["28", "29", "30", "31", "32"];
      return sizes[Math.floor(Math.random() * sizes.length)] || "30";
    }
    const sizes = ["3-4", "5-6", "7-8", "9-10", "11-12"];
    return sizes[Math.floor(Math.random() * sizes.length)] || "7-8";
  }

  return "Универсальный";
}

// Enhanced OrderRow component with product details
function OrderRow({
  order,
  isSelected,
  onSelectionChange,
  disabled,
}: {
  order: Order;
  isSelected: boolean;
  onSelectionChange: (orderId: string, selected: boolean) => void;
  disabled: boolean;
}) {
  const [showProducts, setShowProducts] = useState(false);

  // Calculate total quantity of items
  const totalQuantity = order.items?.reduce(
    (sum, item) => sum + item.quantity,
    0,
  ) || 0;

  // Determine payment status
  const paymentStatus =
    order.orderStatus === "Ожидает оплаты" ? "Не оплачен" : "Оплачен";

  // Determine delivery status based on order status
  const deliveryStatus = getDeliveryStatus(order.orderStatus);

  // Determine delivery method (mocked since it's not in the data)
  const deliveryMethod = "Курьер";

  // Enhance order items with product details if they don't have them
  const enhancedItems = order.items?.map((item) => ({
    ...item,
    productName: item.productName || getProductNameFromSku(item.productSku),
    color: item.color || getSampleColorFromSku(item.productSku),
    size: item.size || getSampleSizeFromSku(item.productSku),
  }));

  return (
    <Card
      className={`w-full overflow-hidden ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      <div className="flex flex-col">
        {/* Order header with ID and amount - clickable to go to details */}
        <div className="bg-muted/30 flex items-center justify-between border-b px-2 py-2 sm:px-3">
          <div className="flex items-center gap-2">
            <OrderSelection
              orderId={order.id}
              isSelected={isSelected}
              onSelectionChange={onSelectionChange}
              disabled={disabled}
            />
            <Link href={`/orders/${order.id}`} className="block flex-1">
              <div className="flex items-center justify-between">
                <div className="max-w-[60%] truncate text-sm font-medium sm:text-base">
                  {order.orderId}
                </div>
                <div className="text-xs font-medium sm:text-sm">
                  {order.totalAmount.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <DeleteOrderButton
              orderId={order.id}
              orderNumber={order.orderId}
              disabled={disabled}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            />
          </div>
        </div>

        {/* Order details in table-like layout */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 p-2 text-xs sm:p-3 sm:text-sm">
          {/* Left column */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground mr-1 truncate">
                Оплата:
              </span>
              <PaymentStatusBadge status={paymentStatus} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground mr-1 truncate">
                Доставка:
              </span>
              <DeliveryStatusBadge status={deliveryStatus} />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground mr-1 truncate">
                Способ:
              </span>
              <span className="truncate font-medium">{deliveryMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground mr-1 truncate">
                Товары:
              </span>
              <div className="flex shrink-0 items-center">
                <Package className="text-muted-foreground mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium">{totalQuantity} шт.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product details section - collapsible */}
        <Collapsible open={showProducts} onOpenChange={setShowProducts}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-auto w-full items-center justify-between rounded-none border-t border-b py-1"
            >
              <span className="text-xs font-medium sm:text-sm">
                Товары в заказе
              </span>
              {showProducts ? (
                <ChevronUp className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <ChevronDown className="text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="bg-muted/10 space-y-2 p-2 sm:p-3">
              {enhancedItems.map((item, index) => (
                <div
                  key={`${item.productSku}-${item.quantity}-${index}`}
                  className="bg-background rounded-md border p-2"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="max-w-[70%] truncate text-xs font-medium sm:text-sm">
                      {item.productName}
                    </div>
                    <div className="text-xs font-medium whitespace-nowrap">
                      {item.price.toLocaleString("ru-RU")} ₽
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] sm:text-xs">
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">
                        Артикул:
                      </span>
                      <span className="font-medium">{item.productSku}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">
                        Кол-во:
                      </span>
                      <span className="font-medium">{item.quantity} шт.</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">Цвет:</span>
                      <div className="flex items-center">
                        <span className="mr-1 font-medium">{item.color}</span>
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border"
                          style={{ backgroundColor: getColorHex(item.color) }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-1">
                        Размер:
                      </span>
                      <span className="font-medium">{item.size}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                <span className="text-muted-foreground">Итого:</span>
                <span className="font-medium">
                  {order.totalAmount.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer with date and action indicator */}
        <Link href={`/orders/${order.id}`} className="block">
          <div className="bg-muted/20 flex items-center justify-between px-2 py-1.5 text-xs sm:px-3 sm:py-2">
            <div className="text-muted-foreground mr-1 truncate">
              {new Date(order.orderDate).toLocaleDateString("ru-RU")}
            </div>
            <div className="text-primary flex shrink-0 items-center">
              <span>Подробнее</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}

// Helper function to get color hex code
function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    Черный: "#000000",
    Белый: "#FFFFFF",
    Красный: "#FF0000",
    Синий: "#0000FF",
    Зеленый: "#008000",
    Желтый: "#FFFF00",
    Серый: "#808080",
    Бежевый: "#F5F5DC",
    Коричневый: "#A52A2A",
    Розовый: "#FFC0CB",
    Голубой: "#87CEEB",
    Фиолетовый: "#800080",
    Оранжевый: "#FFA500",
    Бордовый: "#800000",
    Хаки: "#F0E68C",
  };

  return colorMap[colorName] || "#CCCCCC";
}

// Update the badge components to be more compact on mobile
function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto shrink-0 px-1 py-0.5 text-[10px] font-normal sm:px-1.5 sm:text-xs",
        status === "Оплачен"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-yellow-200 bg-yellow-50 text-yellow-700",
      )}
    >
      {status}
    </Badge>
  );
}

function DeliveryStatusBadge({ status }: { status: string }) {
  let className = "bg-gray-50 text-gray-700 border-gray-200";

  switch (status) {
    case "Ожидает отправки":
      className = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "В пути":
      className = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case "Доставлен":
      className = "bg-green-50 text-green-700 border-green-200";
      break;
    case "Отменен":
      className = "bg-red-50 text-red-700 border-red-200";
      break;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto shrink-0 px-1 py-0.5 text-[10px] font-normal sm:px-1.5 sm:text-xs",
        className,
      )}
    >
      {status}
    </Badge>
  );
}

// Helper function to determine delivery status based on order status
function getDeliveryStatus(orderStatus: string): string {
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
