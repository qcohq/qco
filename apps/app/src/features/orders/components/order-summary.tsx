import { Badge } from "@qco/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { cn } from "@qco/ui/lib/utils";
import type { OrderOutput } from "@qco/validators";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Hash,
  Package,
  Receipt,
  TrendingUp,
  Truck,
} from "lucide-react";

// TODO: Использовать тип из схемы пропсов сводки заказа, если появится в @qco/validators
interface OrderSummaryProps {
  order: OrderOutput;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const formatPrice = (price: string) => {
    return Number.parseFloat(price).toLocaleString("ru-RU");
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Банковская карта";
      case "bank_transfer":
        return "Банковский перевод";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Наличными при получении";
      case "apple_pay":
        return "Apple Pay";
      case "google_pay":
        return "Google Pay";
      case "crypto":
        return "Криптовалюта";
      default:
        return method || "Не указан";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
      case "apple_pay":
      case "google_pay":
        return CreditCard;
      case "bank_transfer":
        return Receipt;
      case "paypal":
        return DollarSign;
      case "cash_on_delivery":
        return DollarSign;
      case "crypto":
        return TrendingUp;
      default:
        return CreditCard;
    }
  };

  const getDeliveryMethodLabel = (method: string) => {
    switch (method) {
      case "standard":
        return "Стандартная доставка";
      case "express":
        return "Экспресс доставка";
      case "pickup":
        return "Самовывоз";
      case "courier":
        return "Курьерская доставка";
      default:
        return method || "Не указан";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "processing":
        return "Обработка";
      case "shipped":
        return "Отправлен";
      case "delivered":
        return "Доставлен";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Ожидает оплаты";
      case "PROCESSING":
        return "Обрабатывается";
      case "COMPLETED":
        return "Оплачен";
      case "FAILED":
        return "Ошибка оплаты";
      case "REFUNDED":
        return "Возвращен";
      case "PARTIALLY_REFUNDED":
        return "Частичный возврат";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";
      case "REFUNDED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "PARTIALLY_REFUNDED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const PaymentMethodIcon = getPaymentMethodIcon(order.paymentMethod);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Сводка заказа</CardTitle>
            <CardDescription>
              Финансовая информация и детали оплаты
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Status */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Статус заказа
          </h4>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn("border", getStatusColor(order.status))}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Способ оплаты
          </h4>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <PaymentMethodIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs mt-1",
                  getPaymentStatusColor(order.paymentStatus || "PENDING"),
                )}
              >
                {getPaymentStatusLabel(order.paymentStatus || "PENDING")}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Delivery Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Способ доставки
          </h4>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <p className="font-medium">
              {getDeliveryMethodLabel(order.shippingMethod)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Financial Summary */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Финансовая сводка
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Товары:</span>
              <span>{formatPrice(order.subtotalAmount)} ₽</span>
            </div>
            {Number.parseFloat(order.shippingAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Доставка:</span>
                <span>{formatPrice(order.shippingAmount)} ₽</span>
              </div>
            )}
            {Number.parseFloat(order.taxAmount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Налог:</span>
                <span>{formatPrice(order.taxAmount)} ₽</span>
              </div>
            )}
            {Number.parseFloat(order.discountAmount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Скидка:</span>
                <span>-{formatPrice(order.discountAmount)} ₽</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Итого:</span>
              <span>{formatPrice(order.totalAmount)} ₽</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Детали заказа
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Номер заказа</p>
                <p className="text-sm text-muted-foreground font-mono">
                  #{order.orderNumber || order.id.substring(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Дата создания</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Количество товаров</p>
                <p className="text-sm text-muted-foreground">
                  {order.items?.length || 0} позиций
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground text-center">
            Валюта: RUB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
