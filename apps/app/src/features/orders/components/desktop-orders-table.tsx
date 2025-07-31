import { Button } from "@qco/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import type { OrderOutput } from "@qco/validators";
import { Package } from "lucide-react";
import Link from "next/link";
import { DeleteOrderButton } from "./delete-order-button";
import { STATUS_LABELS } from "./order-history";
import { OrderSelection } from "./order-selection";
import { SelectAllOrders } from "./select-all-orders";

// TODO: Использовать тип из схемы пропсов десктопной таблицы заказов, если появится в @qco/validators
interface DesktopOrdersTableProps {
  orders: OrderOutput[];
  selectedOrderIds: string[];
  onSelectionChange: (orderId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function DesktopOrdersTable({
  orders,
  selectedOrderIds,
  onSelectionChange,
  disabled = false,
}: DesktopOrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <SelectAllOrders
                orderIds={orders.map((order) => order.id)}
                selectedOrderIds={selectedOrderIds}
                onSelectionChange={(orderIds) => {
                  // Сначала снимаем выбор со всех заказов
                  selectedOrderIds.forEach((id) =>
                    onSelectionChange(id, false),
                  );
                  // Затем выбираем новые заказы
                  orderIds.forEach((id) => onSelectionChange(id, true));
                }}
                disabled={disabled}
              />
            </TableHead>
            <TableHead className="w-20">Номер</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Покупатель</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Доставка</TableHead>
            <TableHead>Товары</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => {
            const totalQuantity =
              order.items?.reduce(
                (acc: number, item) => acc + item.quantity,
                0,
              ) || 0;
            const isSelected = selectedOrderIds.includes(order.id);

            return (
              <TableRow
                key={order.id}
                className={isSelected ? "bg-muted/50" : ""}
              >
                <TableCell className="py-2 sm:py-3">
                  <OrderSelection
                    orderId={order.id}
                    isSelected={isSelected}
                    onSelectionChange={onSelectionChange}
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell className="py-2 text-xs sm:py-3 sm:text-sm">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    {order.orderNumber || order.id}
                  </Link>
                </TableCell>
                <TableCell className="py-2 text-xs sm:py-3 sm:text-sm">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("ru-RU")
                    : "-"}
                </TableCell>
                <TableCell className="py-2 text-xs sm:py-3 sm:text-sm">
                  {order.customerId ? (
                    <Link
                      href={`/customers/${order.customerId}`}
                      className="text-primary hover:underline"
                    >
                      {`${order.metadata?.customerInfo?.firstName || ""} ${order.metadata?.customerInfo?.lastName || ""}`}
                    </Link>
                  ) : (
                    `${order.metadata?.customerInfo?.firstName || ""} ${order.metadata?.customerInfo?.lastName || "-"}`
                  )}
                </TableCell>
                <TableCell className="py-2 sm:py-3">
                  <span>{STATUS_LABELS[order.status] || order.status}</span>
                </TableCell>
                <TableCell className="py-2 text-xs sm:py-3 sm:text-sm">
                  {order.deliveryMethod || "-"}
                </TableCell>
                <TableCell className="py-2 text-xs sm:py-3 sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="text-muted-foreground mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>{totalQuantity} шт.</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-right text-xs sm:py-3 sm:text-sm">
                  {order.totalAmount?.toLocaleString("ru-RU")} ₽
                </TableCell>
                <TableCell className="py-2 text-right sm:py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-7 text-xs sm:h-8"
                    >
                      <Link href={`/orders/${order.id}`}>Подробнее</Link>
                    </Button>
                    <DeleteOrderButton
                      orderId={order.id}
                      orderNumber={order.orderNumber}
                      disabled={disabled}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs sm:h-8"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
