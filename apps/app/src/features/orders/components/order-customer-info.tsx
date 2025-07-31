import { Avatar, AvatarFallback } from "@qco/ui/components/avatar";
import { Badge } from "@qco/ui/components/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import type { OrderOutput } from "@qco/validators";
import { Calendar, Hash, Mail, MapPin, Phone, User } from "lucide-react";


// TODO: Использовать тип из схемы пропсов информации о клиенте заказа, если появится в @qco/validators
interface OrderCustomerInfoProps {
  order: OrderOutput;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  const metadata = order.metadata as OrderMetadata;

  const getCustomerInitials = () => {
    const firstName = metadata?.customerInfo?.firstName || "";
    const lastName = metadata?.customerInfo?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "К";
  };

  const getCustomerName = () => {
    const firstName = metadata?.customerInfo?.firstName || "";
    const lastName = metadata?.customerInfo?.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Не указан";
  };

  const getCustomerEmail = () => {
    return metadata?.customerInfo?.email || "Не указан";
  };

  const getCustomerPhone = () => {
    return metadata?.customerInfo?.phone || "Не указан";
  };

  const getShippingAddress = () => {
    const address = metadata?.shippingAddress;
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Информация о клиенте</CardTitle>
            <CardDescription>
              Контактные данные и адрес доставки
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg font-semibold">
              {getCustomerInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{getCustomerName()}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                ID: {order.customerId || "N/A"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Заказчик
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Контактная информация
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground truncate">
                  {getCustomerEmail()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Телефон</p>
                <p className="text-sm text-muted-foreground">
                  {getCustomerPhone()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Shipping Address */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Адрес доставки
          </h4>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getShippingAddress()}
              </p>
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
              <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Номер заказа</p>
                <p className="text-sm text-muted-foreground font-mono">
                  #{order.orderNumber || order.id.substring(0, 8)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Дата заказа</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        {order.notes && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Примечания
              </h4>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.notes}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
