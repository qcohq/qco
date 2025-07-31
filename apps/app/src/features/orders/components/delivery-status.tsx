import { Badge } from "@qco/ui/components/badge";
import type { OrderOutput } from "@qco/validators";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle, Package, Truck } from "lucide-react";

type DeliveryStatus = keyof typeof DELIVERY_STATUS_MAP;

// Маппинг статусов заказа из API в статусы доставки
const ORDER_STATUS_TO_DELIVERY_MAP: Record<string, DeliveryStatus> = {
  "Ожидает оплаты": "pending",
  Новый: "pending",
  "В обработке": "processing",
  Обработка: "processing",
  Отправлен: "shipped",
  "В доставке": "out_for_delivery",
  Доставляется: "out_for_delivery",
  Доставлен: "delivered",
} as const;

const DELIVERY_STATUS_MAP = {
  pending: { label: "Ожидает обработки", completed: false, icon: Package },
  processing: { label: "В обработке", completed: true, icon: CheckCircle },
  shipped: { label: "Отправлен", completed: true, icon: Truck },
  out_for_delivery: { label: "В пути", completed: false, icon: Truck },
  delivered: { label: "Доставлен", completed: false, icon: CheckCircle },
} as const;

// TODO: Использовать тип из схемы пропсов статуса доставки, если появится в @qco/validators
interface DeliveryStatusProps {
  order: OrderOutput;
}

export function DeliveryStatus({ order }: DeliveryStatusProps) {
  // Определяем текущий статус доставки
  const currentStatus = ORDER_STATUS_TO_DELIVERY_MAP[order.status] || "pending";
  const deliveryProgress =
    Object.keys(DELIVERY_STATUS_MAP).indexOf(currentStatus) + 1;
  const totalSteps = Object.keys(DELIVERY_STATUS_MAP).length;
  const progressPercentage = (deliveryProgress / totalSteps) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Статус доставки
          </h2>
          <p className="text-sm text-gray-500">
            Текущий статус и прогресс доставки
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Прогресс-бар */}
        <div className="relative">
          <div className="bg-gray-200 relative h-2 overflow-hidden rounded-full w-full">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Статусы */}
        <div className="flex items-center justify-between">
          {Object.entries(DELIVERY_STATUS_MAP).map(
            ([status, { label, completed, icon: Icon }]) => {
              const isActive = status === currentStatus;
              const isCompleted =
                completed ||
                Object.keys(DELIVERY_STATUS_MAP).indexOf(status) <
                Object.keys(DELIVERY_STATUS_MAP).indexOf(currentStatus);

              return (
                <div
                  key={status}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors
                  ${isActive ? "bg-primary text-white" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`mt-2 text-xs ${isActive ? "font-medium text-gray-900" : "text-gray-500"}`}
                  >
                    {label}
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Текущий статус */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">Текущий статус:</div>
          <div className="flex items-center gap-2">
            <Badge
              variant={currentStatus === "delivered" ? "default" : "secondary"}
            >
              {DELIVERY_STATUS_MAP[currentStatus]?.label || "Статус неизвестен"}
            </Badge>
            <span className="text-xs text-gray-500">
              {format(new Date(order.updatedAt), "d MMMM yyyy", { locale: ru })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
