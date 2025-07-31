import { OrderStatus, ORDER_STATUS_LABELS } from "@qco/db/schema";
import type { OrderHistoryOutput, OrderOutput } from "@qco/validators";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";

const STATUS_ICONS = {
  [OrderStatus.PENDING]: Clock,
  [OrderStatus.CONFIRMED]: CheckCircle2,
  [OrderStatus.PROCESSING]: Package,
  [OrderStatus.SHIPPED]: Truck,
  [OrderStatus.DELIVERED]: CheckCircle2,
  [OrderStatus.CANCELLED]: XCircle,
  [OrderStatus.REFUNDED]: RefreshCw,
} as const;

export const STATUS_LABELS = {
  [OrderStatus.PENDING]: ORDER_STATUS_LABELS[OrderStatus.PENDING],
  [OrderStatus.CONFIRMED]: ORDER_STATUS_LABELS[OrderStatus.CONFIRMED],
  [OrderStatus.PROCESSING]: ORDER_STATUS_LABELS[OrderStatus.PROCESSING],
  [OrderStatus.SHIPPED]: ORDER_STATUS_LABELS[OrderStatus.SHIPPED],
  [OrderStatus.DELIVERED]: ORDER_STATUS_LABELS[OrderStatus.DELIVERED],
  [OrderStatus.CANCELLED]: ORDER_STATUS_LABELS[OrderStatus.CANCELLED],
  [OrderStatus.REFUNDED]: ORDER_STATUS_LABELS[OrderStatus.REFUNDED],
} as const;

export function OrderHistory({ order }: { order: OrderOutput }) {
  if (!order.history || order.history.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 bg-primary rounded-full" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              История заказа
            </h2>
            <p className="text-sm text-gray-500">
              История изменений статуса заказа
            </p>
          </div>
        </div>
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          История заказа пока пуста
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            История заказа
          </h2>
          <p className="text-sm text-gray-500">
            История изменений статуса заказа
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {order.history.map((event: OrderHistoryOutput) => {
          const Icon =
            STATUS_ICONS[event.status as keyof typeof STATUS_ICONS] || Clock;
          const label =
            STATUS_LABELS[event.status as keyof typeof STATUS_LABELS] ||
            event.status;

          return (
            <li key={event.id} className="flex gap-4 items-start">
              <div className="bg-primary text-white flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {format(new Date(event.createdAt), "d MMMM yyyy, HH:mm", {
                    locale: ru,
                  })}
                </div>
                {event.comment && (
                  <div className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                    {event.comment}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
