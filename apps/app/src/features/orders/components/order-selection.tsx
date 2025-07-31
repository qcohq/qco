"use client";

import { Checkbox } from "@qco/ui/components/checkbox";

// TODO: Использовать тип из схемы пропсов выбора заказа, если появится в @qco/validators
interface OrderSelectionProps {
  orderId: string;
  isSelected: boolean;
  onSelectionChange: (orderId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function OrderSelection({
  orderId,
  isSelected,
  onSelectionChange,
  disabled = false,
}: OrderSelectionProps) {
  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) =>
        onSelectionChange(orderId, checked as boolean)
      }
      disabled={disabled}
      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    />
  );
}
