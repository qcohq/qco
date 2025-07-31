import { Badge } from "@qco/ui/components/badge";
import { cn } from "@qco/ui/lib/utils";

export function DeliveryStatusBadge({ status }: { status: string }) {
  let className = "bg-gray-50 text-gray-700 border-gray-200";
  switch (status) {
    case "Ожидает отправки":
      className = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "В пути":
      className = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case "Доставлен":
      className = "bg-green-50 text-green-700 border-green-200";
      break;
    case "Отменен":
      className = "bg-red-50 text-red-700 border-red-200";
      break;
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto px-1 py-0.5 text-[10px] font-normal sm:px-1.5 sm:text-xs",
        className,
      )}
    >
      {status}
    </Badge>
  );
}

export function getDeliveryStatus(status: string): string {
  switch (status) {
    case "Ожидает оплаты":
      return "Ожидает отправки";
    case "Обработка":
      return "Ожидает отправки";
    case "Отправлен":
      return "В пути";
    case "Доставлен":
      return "Доставлен";
    case "Отменен":
      return "Отменен";
    default:
      return "Неизвестно";
  }
}
