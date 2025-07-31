"use client";

import { Checkbox } from "@qco/ui/components/checkbox";

// TODO: Использовать тип из схемы пропсов выбора всех заказов, если появится в @qco/validators
interface SelectAllOrdersProps {
  orderIds: string[];
  selectedOrderIds: string[];
  onSelectionChange: (orderIds: string[]) => void;
  disabled?: boolean;
}

export function SelectAllOrders({
  orderIds,
  selectedOrderIds,
  onSelectionChange,
  disabled = false,
}: SelectAllOrdersProps) {
  const allSelected =
    orderIds.length > 0 && selectedOrderIds.length === orderIds.length;
  const someSelected = selectedOrderIds.length > 0 && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(orderIds);
    } else {
      onSelectionChange([]);
    }
  };

  return (
    <Checkbox
      checked={allSelected}
      ref={(ref) => {
        if (ref) {
          ref.indeterminate = someSelected;
        }
      }}
      onCheckedChange={handleSelectAll}
      disabled={disabled || orderIds.length === 0}
      className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
    />
  );
}
