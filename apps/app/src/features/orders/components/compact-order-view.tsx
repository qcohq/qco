"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Separator } from "@qco/ui/components/separator";
import type { OrderOutput } from "@qco/validators";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Printer,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OrderStatusBadge } from "@/components/order-status-badge";

// TODO: Использовать тип из схемы пропсов компактного представления заказа, если появится в @qco/validators
interface CompactOrderViewProps {
  order: OrderOutput;
}

export function CompactOrderView({ order }: CompactOrderViewProps) {
  const [expandedSections, setExpandedSections] = useState({
    items: true,
    customer: false,
    shipping: false,
    payment: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Card className="animate-in fade-in-0 zoom-in-95 duration-300">
      {/* Шапка с основной информацией и статусом */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <OrderStatusBadge status={order.orderStatus} className="mr-2" />
              {(order.totalAmount || 0).toLocaleString("ru-RU")} ₽
            </CardTitle>
            <CardDescription>
              {order.items?.length || 0} {getProductsText(order.items?.length || 0)} |{" "}
              {order.paymentMethod}
            </CardDescription>
          </div>
          <div>
            <Select defaultValue={order.orderStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ожидает оплаты">Ожидает оплаты</SelectItem>
                <SelectItem value="Обработка">Обработка</SelectItem>
                <SelectItem value="Отправлен">Отправлен</SelectItem>
                <SelectItem value="Доставлен">Доставлен</SelectItem>
                <SelectItem value="Отменен">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Секция товаров */}
        <div className="overflow-hidden rounded-lg border">
          <button
            type="button"
            className="bg-muted/50 flex cursor-pointer items-center justify-between p-3 w-full"
            onClick={() => toggleSection("items")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSection("items");
              }
            }}
          >
            <h3 className="font-medium">Товары в заказе</h3>
            <Button variant="ghost" size="sm">
              {expandedSections.items ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </button>
          {expandedSections.items && (
            <div className="border-t p-3">
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={`order-item-${item.name}-${item.sku || item.id || index}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                        <Package className="text-muted-foreground h-4 w-4" />
                      </div>
                      <span>{item.productSku}</span>
                    </div>
                    <div className="text-right">
                      <div>{item.quantity} шт.</div>
                      <div className="font-medium">
                        {item.price.toLocaleString("ru-RU")} ₽
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Итого:</span>
                  <span>
                    {(order.totalAmount || 0).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Секция информации о клиенте */}
        <div className="overflow-hidden rounded-lg border">
          <button
            type="button"
            className="bg-muted/50 flex cursor-pointer items-center justify-between p-3 w-full"
            onClick={() => toggleSection("customer")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSection("customer");
              }
            }}
          >
            <h3 className="font-medium">Клиент</h3>
            <Button variant="ghost" size="sm">
              {expandedSections.customer ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </button>
          {expandedSections.customer && (
            <div className="space-y-4 border-t p-3">
              {/* Шапка с именем клиента */}
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8">
                  <User className="text-muted-foreground h-5 w-5 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="line-clamp-1 text-base font-medium sm:text-sm"
                    title={order.customerName}
                  >
                    {order.customerName}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    ID: {order.customerId}
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="xs:grid-cols-[80px_1fr] grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-[100px_1fr]">
                <div className="text-muted-foreground font-medium">Email:</div>
                <div
                  className="xs:pb-0 truncate pb-1"
                  title="customer@example.com"
                >
                  customer@example.com
                </div>
                <div className="text-muted-foreground font-medium">
                  Телефон:
                </div>
                <div
                  className="xs:pb-0 truncate pb-1"
                  title="+7 (900) 123-45-67"
                >
                  +7 (900) 123-45-67
                </div>
              </div>

              {/* Кнопка профиля */}
              <div className="pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-full sm:h-8"
                >
                  <Link href={`/customers/${order.customerId}`}>
                    <User className="mr-2 h-4 w-4" />
                    Профиль клиента
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Секция информации о доставке */}
        <div className="overflow-hidden rounded-lg border">
          <button
            type="button"
            className="bg-muted/50 flex cursor-pointer items-center justify-between p-3 w-full"
            onClick={() => toggleSection("shipping")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSection("shipping");
              }
            }}
          >
            <h3 className="font-medium">Доставка</h3>
            <Button variant="ghost" size="sm">
              {expandedSections.shipping ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </button>
          {expandedSections.shipping && (
            <div className="border-t p-3">
              <div className="mb-2 flex items-center gap-3">
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="font-medium">Курьерская доставка</div>
              </div>
              <div className="mb-2 text-sm">
                <div className="text-muted-foreground mb-1">Адрес:</div>
                <div>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground mb-1">
                  Ожидаемая дата:
                </div>
                <div>
                  {new Date(
                    new Date(order.orderDate).getTime() +
                    1000 * 60 * 60 * 24 * 3,
                  ).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Секция информации об оплате */}
        <div className="overflow-hidden rounded-lg border">
          <button
            type="button"
            className="bg-muted/50 flex cursor-pointer items-center justify-between p-3 w-full"
            onClick={() => toggleSection("payment")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSection("payment");
              }
            }}
          >
            <h3 className="font-medium">Оплата</h3>
            <Button variant="ghost" size="sm">
              {expandedSections.payment ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </button>
          {expandedSections.payment && (
            <div className="border-t p-3">
              <div className="mb-2 flex items-center gap-3">
                <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                </div>
                <div className="font-medium">{order.paymentMethod}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Статус:</div>
                <div>
                  {order.orderStatus === "Ожидает оплаты"
                    ? "Не оплачен"
                    : "Оплачен"}
                </div>
                {order.orderStatus !== "Ожидает оплаты" && (
                  <>
                    <div className="text-muted-foreground">Дата оплаты:</div>
                    <div>
                      {new Date(
                        new Date(order.orderDate).getTime() + 1000 * 60 * 60,
                      ).toLocaleDateString("ru-RU")}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Обновить статус
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Уведомление
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Печать
          </Button>
          {order.orderStatus === "Ожидает оплаты" && (
            <Button variant="destructive" size="sm">
              Отменить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Вспомогательная функция для склонения слова "товар"
function getProductsText(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "товар";
  }
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return "товара";
  }
  return "товаров";
}
