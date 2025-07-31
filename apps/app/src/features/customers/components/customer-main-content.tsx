import type { UpdateCustomerInput } from "@qco/validators";
import type { CustomerMainContentProps } from "../types";
import { CustomerInfoCard } from "./customer-info-card";
import { CustomerTabs } from "./customer-tabs";

// TODO: Использовать тип из схемы пропсов основного контента клиента, если появится в @qco/validators
// Исправленный пропс
interface CustomerMainContentFixedProps
  extends Omit<CustomerMainContentProps, "onUpdateCustomer"> {
  onUpdateCustomer: (data: UpdateCustomerInput) => void;
}

export function CustomerMainContent({
  customer,
  onUpdateCustomer,
  isUpdating,
}: CustomerMainContentFixedProps) {
  return (
    <div className="space-y-8">
      <CustomerInfoCard customer={customer} />
      <CustomerTabs
        customer={customer}
        onUpdateCustomer={onUpdateCustomer}
        isUpdating={isUpdating}
      />
    </div>
  );
}
