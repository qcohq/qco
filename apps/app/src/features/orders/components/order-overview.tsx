"use client";

import { Avatar, AvatarFallback } from "@qco/ui/components/avatar";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
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
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

// TODO: Использовать тип из схемы пропсов обзора заказа, если появится в @qco/validators
interface OrderOverviewProps {
  order: OrderOutput;
}

export function OrderOverview({ order }: OrderOverviewProps) {
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "Ожидает",
          variant: "secondary" as const,
          className:
            "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
        };
      case "processing":
        return {
          icon: Package,
          label: "Обработка",
          variant: "secondary" as const,
          className:
            "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        };
      case "shipped":
        return {
          icon: Truck,
          label: "Отправлен",
          variant: "secondary" as const,
          className:
            "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
        };
      case "delivered":
        return {
          icon: CheckCircle,
          label: "Доставлен",
          variant: "secondary" as const,
          className:
            "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        };
      case "cancelled":
        return {
          icon: AlertCircle,
          label: "Отменен",
          variant: "destructive" as const,
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        };
      default:
        return {
          icon: AlertCircle,
          label: status,
          variant: "secondary" as const,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const _getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: CheckCircle,
          label: "Оплачен",
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "PENDING":
        return {
          icon: Clock,
          label: "Ожидает оплаты",
          className: "bg-orange-50 text-orange-700 border-orange-200",
        };
      case "PROCESSING":
        return {
          icon: Loader2,
          label: "Обрабатывается",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "FAILED":
        return {
          icon: AlertCircle,
          label: "Ошибка оплаты",
          className: "bg-red-50 text-red-700 border-red-200",
        };
      case "REFUNDED":
        return {
          icon: RefreshCw,
          label: "Возвращен",
          className: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "PARTIALLY_REFUNDED":
        return {
          icon: RefreshCw,
          label: "Частичный возврат",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          icon: Clock,
          label: "Неизвестно",
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const getCustomerInitials = () => {
    const firstName = (order.metadata as any)?.customerInfo?.firstName || "";
    const lastName = (order.metadata as any)?.customerInfo?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "К";
  };

  const getCustomerName = () => {
    const firstName = (order.metadata as any)?.customerInfo?.firstName || "";
    const lastName = (order.metadata as any)?.customerInfo?.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Не указан";
  };

  const getCustomerEmail = () => {
    return (order.metadata as any)?.customerInfo?.email || "Не указан";
  };

  const getCustomerPhone = () => {
    return (order.metadata as any)?.customerInfo?.phone || "Не указан";
  };

  const getShippingAddress = () => {
    const address = (order.metadata as any)?.shippingAddress;
    if (!address) return "Не указан";

    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Не указан";
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

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalQuantity =
    order.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ||
    0;
  const orderNumber = order.orderNumber || (order.id ? order.id.substring(0, 8) : "N/A");

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
  };

  const getCustomerCode = () => {
    return order.customer?.customerCode || order.customerId || "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Заголовок заказа */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  Заказ #{orderNumber}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyOrderNumber}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Создан {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(order.totalAmount)} ₽
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm px-3 py-1.5 font-medium",
                  statusConfig.className,
                )}
              >
                <StatusIcon className="h-4 w-4 mr-1.5" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Основная информация */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Информация о клиенте */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Клиент</CardTitle>
                <CardDescription>Информация о покупателе</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="text-base font-semibold">
                  {getCustomerInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-base">{getCustomerName()}</p>
                <p className="text-sm text-muted-foreground">
                  ID: {getCustomerCode()}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getCustomerEmail()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getCustomerPhone()}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {getShippingAddress()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Детали заказа */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Детали заказа</CardTitle>
                <CardDescription>Информация о товарах</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Позиций</p>
                <p className="text-lg font-semibold">{order.items?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Количество</p>
                <p className="text-lg font-semibold">{totalQuantity} шт.</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Доставка:</span>
                <span className="text-sm font-medium">
                  {order.shippingMethod ? getDeliveryMethodLabel(order.shippingMethod) : "Не указано"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Оплата:</span>
                <span className="text-sm font-medium">
                  {order.paymentMethod ? getPaymentMethodLabel(order.paymentMethod) : "Не указано"}
                </span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Товары:</span>
                <span className="font-medium">
                  {formatPrice(order.subtotalAmount)} ₽
                </span>
              </div>
              {Number.parseFloat(order.shippingAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-medium">
                    {formatPrice(order.shippingAmount)} ₽
                  </span>
                </div>
              )}
              {Number.parseFloat(order.taxAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Налог:</span>
                  <span className="font-medium">
                    {formatPrice(order.taxAmount)} ₽
                  </span>
                </div>
              )}
              {Number.parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Скидка:</span>
                  <span className="font-medium text-green-600">
                    -{formatPrice(order.discountAmount)} ₽
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Примечания к заказу */}
      {order.notes && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-2">
                  Примечания к заказу
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.notes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
