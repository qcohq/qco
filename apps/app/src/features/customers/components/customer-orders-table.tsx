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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import type { OrderOutput } from "@qco/validators";
import { ORDER_STATUS_LABELS } from "@qco/db/schema";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Функция для определения варианта бейджа статуса
function getStatusVariant(status: string) {
  switch (status) {
    case "delivered":
      return "default";
    case "shipped":
      return "secondary";
    case "processing":
      return "outline";
    case "pending":
      return "destructive";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

// Единый словарь статусов
const getStatusLabel = (status: string) => ORDER_STATUS_LABELS[status] || status;

// TODO: Использовать тип из схемы пропсов таблицы заказов клиента, если появится в @qco/validators
type CustomerOrdersTableProps = {
  orders: OrderOutput[];
  isLoading?: boolean;
};

export function CustomerOrdersTable({
  orders,
  isLoading,
}: CustomerOrdersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`customer-orders-table-skeleton-${Date.now()}-${i}`}
            className="animate-pulse"
          >
            <div className="h-16 bg-muted rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Номер заказа</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
          <TableHead className="text-right">Товары</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-muted-foreground py-8 text-center"
            >
              У клиента пока нет заказов
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/50">
              <TableCell>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center font-medium hover:underline"
                >
                  {order.orderNumber}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString("ru-RU")}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(Number.parseFloat(order.totalAmount))}
              </TableCell>
              <TableCell className="text-right">{order.items?.length || 0}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Открыть меню</span>
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
