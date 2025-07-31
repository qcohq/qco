"use client";

import { Avatar, AvatarFallback } from "@qco/ui/components/avatar";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { cn } from "@qco/ui/lib/utils";
import type { OrderOutput } from "@qco/validators";
import { ORDER_STATUS_LABELS } from "@qco/db/schema";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Package,
  Truck,
  XCircle,
  RefreshCw,
  Edit,
  RotateCcw,
  CheckSquare,
  XSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteOrderButton } from "./delete-order-button";
import { DeleteOrderDropdownItem } from "./delete-order-dropdown-item";
import {
  ConfirmOrderButton,
  ProcessOrderButton,
  ShipOrderButton,
  DeliverOrderButton,
  CancelOrderButton,
  RefundOrderButton
} from "./update-order-status-button";
import { CopyOrderNumberButton } from "./copy-order-number-button";
import { PrintOrderButton } from "./print-order-button";

// TODO: Использовать тип из схемы пропсов таблицы данных заказов, если появится в @qco/validators
interface OrdersDataTableProps {
  orders: OrderOutput[];
  selectedOrderIds: string[];
  onSelectionChange: (orderId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function OrdersDataTable({
  orders,
  selectedOrderIds,
  onSelectionChange,
  disabled = false,
}: OrdersDataTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      orders.forEach((order) => onSelectionChange(order.id, true));
    } else {
      orders.forEach((order) => onSelectionChange(order.id, false));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "confirmed":
        return CheckCircle;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      case "refunded":
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "refunded":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUS_LABELS[status] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Карта";
      case "bank_transfer":
        return "Перевод";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Наличные";
      default:
        return method;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Ожидает";
      case "PROCESSING":
        return "Обрабатывается";
      case "COMPLETED":
        return "Оплачен";
      case "FAILED":
        return "Ошибка";
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCustomerInitials = (order: OrderOutput) => {
    if (order.customer) {
      const firstName = order.customer.firstName || "";
      const lastName = order.customer.lastName || "";
      const name = order.customer.name || "";

      if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      }
      if (name) {
        return name.charAt(0).toUpperCase();
      }
      if (firstName) {
        return firstName.charAt(0).toUpperCase();
      }
      if (lastName) {
        return lastName.charAt(0).toUpperCase();
      }
    }
    return "К";
  };

  const getCustomerName = (order: OrderOutput) => {
    if (order.customer) {
      const firstName = order.customer.firstName || "";
      const lastName = order.customer.lastName || "";
      const name = order.customer.name || "";

      if (firstName && lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      if (name) {
        return name;
      }
      if (firstName) {
        return firstName;
      }
      if (lastName) {
        return lastName;
      }
      if (order.customer.email) {
        return order.customer.email;
      }
    }
    return `Клиент #${order.customerId?.substring(0, 6)}`;
  };

  const getCustomerEmail = (order: OrderOutput) => {
    return order.customer?.email || "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                disabled={disabled}
              />
            </TableHead>
            <TableHead className="w-32">Заказ</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Оплата</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);
            const StatusIcon = getStatusIcon(order.status);
            const totalQuantity =
              order.items?.reduce(
                (acc: number, item) => acc + item.quantity,
                0,
              ) || 0;

            return (
              <TableRow
                key={order.id}
                className={cn(
                  "group hover:bg-muted/50 transition-colors",
                  isSelected && "bg-muted/50",
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      onSelectionChange(order.id, !!checked)
                    }
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        #{order.orderNumber || order.id.substring(0, 8)}
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        {totalQuantity} шт.
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getCustomerInitials(order)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <Link
                        href={`/customers/${order.customerId}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {getCustomerName(order)}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {getCustomerEmail(order)}
                      </p>
                      {order.customer?.phone && (
                        <p className="text-xs text-muted-foreground">
                          {order.customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge
                      variant="outline"
                      className={cn("border", getStatusColor(order.status))}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {getPaymentMethodLabel(
                        order.paymentMethod || "credit_card",
                      )}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        getPaymentStatusColor(order.paymentStatus || "PENDING"),
                      )}
                    >
                      {getPaymentStatusLabel(order.paymentStatus || "PENDING")}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">
                      {Number.parseFloat(order.totalAmount).toLocaleString(
                        "ru-RU",
                      )}{" "}
                      ₽
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items?.length || 0} товаров
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Действия с заказом</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Основные действия */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Просмотр заказа
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/orders/${order.id}/edit`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать заказ
                        </Link>
                      </DropdownMenuItem>

                      <CopyOrderNumberButton
                        orderNumber={order.orderNumber || order.id.substring(0, 8)}
                      />

                      <DropdownMenuSeparator />

                      {/* Статусы заказа */}
                      <DropdownMenuLabel>Изменить статус</DropdownMenuLabel>
                      <ConfirmOrderButton orderId={order.id} currentStatus={order.status} />
                      <ProcessOrderButton orderId={order.id} currentStatus={order.status} />
                      <ShipOrderButton orderId={order.id} currentStatus={order.status} />
                      <DeliverOrderButton orderId={order.id} currentStatus={order.status} />
                      <CancelOrderButton orderId={order.id} currentStatus={order.status} />
                      <RefundOrderButton orderId={order.id} currentStatus={order.status} />

                      <DropdownMenuSeparator />

                      {/* Печать */}
                      <DropdownMenuLabel>Печать</DropdownMenuLabel>
                      <PrintOrderButton
                        orderId={order.id}
                        orderNumber={order.orderNumber || order.id.substring(0, 8)}
                      />

                      <DropdownMenuSeparator />

                      {/* Удаление */}
                      <DeleteOrderDropdownItem
                        orderId={order.id}
                        orderNumber={order.orderNumber || order.id.substring(0, 8)}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
