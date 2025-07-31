import { Badge } from "@qco/ui/components/badge";
import { cn } from "@qco/ui/lib/utils";

type OrderStatus =
  | "Ожидает оплаты"
  | "Обработка"
  | "Отправлен"
  | "Доставлен"
  | "Отменен";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined = "outline";

  let statusColor = "";

  switch (status) {
    case "Ожидает оплаты":
      variant = "outline";
      statusColor = "text-yellow-600 border-yellow-300 bg-yellow-50";
      break;
    case "Обработка":
      variant = "outline";
      statusColor = "text-blue-600 border-blue-300 bg-blue-50";
      break;
    case "Отправлен":
      variant = "outline";
      statusColor = "text-purple-600 border-purple-300 bg-purple-50";
      break;
    case "Доставлен":
      variant = "outline";
      statusColor = "text-green-600 border-green-300 bg-green-50";
      break;
    case "Отменен":
      variant = "outline";
      statusColor = "text-red-600 border-red-300 bg-red-50";
      break;
    default:
      variant = "outline";
      statusColor = "";
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        statusColor,
        "h-auto px-1.5 py-0.5 text-xs font-normal whitespace-nowrap sm:px-2 sm:py-0.5 sm:font-medium",
        className,
      )}
    >
      {status}
    </Badge>
  );
}
