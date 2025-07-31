import { Button } from "@qco/ui/components/button";
import { Download, Printer, Send } from "lucide-react";
import { ViewModeToggle } from "@/features/orders/components/view-mode-toggle";

// TODO: Использовать тип из схемы пропсов панели инструментов деталей заказа, если появится в @qco/validators
interface OrderDetailsToolbarProps {
  orderNumber: string;
  paymentStatus: string;
  compactMode: boolean;
  onToggle: (value: boolean) => void;
}

export function OrderDetailsToolbar({
  orderNumber: _,
  compactMode,
  onToggle,
}: OrderDetailsToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      <ViewModeToggle compactMode={compactMode} onToggle={onToggle} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 justify-center sm:flex-none"
        >
          <Printer className="mr-2 h-4 w-4" />
          Печать
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 justify-center sm:flex-none"
        >
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <Button size="sm" className="flex-1 justify-center sm:flex-none">
          <Send className="mr-2 h-4 w-4" />
          Отправить
        </Button>
      </div>
    </div>
  );
}
