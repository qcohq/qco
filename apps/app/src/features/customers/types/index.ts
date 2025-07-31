import type { RouterOutputs } from "@qco/api";

// TODO: Использовать тип из схемы данных клиента, если появится в @qco/validators
export type Customer = RouterOutputs["customers"]["getById"];

// TODO: Использовать тип из схемы пропсов страницы деталей клиента, если появится в @qco/validators
export type CustomerDetailPageProps = {
  customerId: string;
};

// TODO: Использовать тип из схемы пропсов заголовка клиента, если появится в @qco/validators
export type CustomerHeaderProps = {
  customer: Customer;
  customerId: string;
  onDeleteClick: () => void;
  isDeleting: boolean;
  isUpdating: boolean;
};

// TODO: Использовать тип из схемы пропсов основного контента клиента, если появится в @qco/validators
export type CustomerMainContentProps = {
  customer: Customer;
  onUpdateCustomer: (
    data: RouterOutputs["customers"]["update"]["customer"],
  ) => void;
  isUpdating: boolean;
};

// TODO: Использовать тип из схемы пропсов сайдбара клиента, если появится в @qco/validators
export type CustomerSidebarProps = {
  customer: Customer;
};

// TODO: Использовать тип из схемы пропсов диалога удаления клиента, если появится в @qco/validators
export type DeleteCustomerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerId: string;
  customerName: string;
  isDeleting: boolean;
};
