"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { cn } from "@qco/ui/lib/utils";
import type { OrderOutput } from "@qco/validators";
import { ORDER_STATUS_LABELS } from "@qco/db/schema";
import { Calendar, ExternalLink, Package } from "lucide-react";
import Link from "next/link";

// Функция для определения цвета статуса
function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "shipped":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Единый словарь статусов
const getStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;

// TODO: Использовать тип из схемы пропсов мобильного списка заказов клиента, если появится в @qco/validators
type CustomerOrdersMobileListProps = {
  orders: OrderOutput[];
  isLoading?: boolean;
};

export function CustomerOrdersMobileList({
  orders,
  isLoading,
}: CustomerOrdersMobileListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`customer-orders-mobile-skeleton-${Date.now()}-${i}`}
            className="animate-pulse"
          >
            <div className="h-24 bg-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        У клиента пока нет заказов
      </div>
    );
  }

  return (
    <div className="divide-y">
      {orders.map((order) => (
        <div key={order.id} className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center font-medium hover:underline"
              >
                {order.orderNumber}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>

              <div className="mt-1.5 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-normal",
                    getStatusColor(order.status),
                  )}
                >
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="mt-2 flex flex-col gap-1">
                <div className="text-muted-foreground flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center text-xs">
                  <Package className="mr-1 h-3 w-3" />
                  <span>{order.items?.length || 0} товар(ов)</span>
                </div>
              </div>

              <div className="mt-2">
                <span className="font-medium">
                  {new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  }).format(Number.parseFloat(order.totalAmount))}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Открыть меню</span>
                  <span className="text-xs">⋮</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/orders/${order.id}`}>Просмотр заказа</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Изменить статус</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Отправить счет</DropdownMenuItem>
                <DropdownMenuItem>Создать возврат</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
