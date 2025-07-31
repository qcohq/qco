import { Card, CardContent } from "@qco/ui/components/card";
import { Calendar, CircleDollarSign, User } from "lucide-react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/order-status-badge";
import type { Order } from "@qco/validators";

// TODO: Использовать тип из схемы пропсов карточки заказа, если появится в @qco/validators
export function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <Link
          href={`/orders/${order.id}`}
          className="hover:bg-accent/50 block p-3 sm:p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
            <div className="max-w-[60%] truncate text-base font-medium">
              {order.orderId}
            </div>
            <OrderStatusBadge
              status={order.orderStatus}
              className="shrink-0 text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <User className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-sm">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span className="text-sm">
                {new Date(order.orderDate).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CircleDollarSign className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span className="text-sm font-medium">
                {(order.totalAmount || 0).toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-end border-t pt-2 sm:mt-3 sm:pt-3">
            <div className="text-primary text-xs">
              Нажмите для просмотра деталей
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
