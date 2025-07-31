import type { OrderOutput } from "@qco/validators";
import { CustomerInfo } from "./customer-info";
import { OrderActions } from "./order-actions";
import { OrderHistory } from "./order-history";
import { OrderInfo } from "./order-info";
import { OrderItemsTable } from "./order-items-table";
import { OrderTabs } from "./order-tabs";
import { PaymentInfo } from "./payment-info";
import { ShippingAddressInfo } from "./shipping-address-info";

// TODO: Использовать тип из схемы пропсов детального представления заказа, если появится в @qco/validators
interface DetailedOrderViewProps {
  order: OrderOutput;
}

export function DetailedOrderViewComponent({ order }: DetailedOrderViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <OrderInfo order={order} />
      {/* Таблица товаров на всю ширину */}
      <div className="w-full">
        <OrderItemsTable order={order} />
      </div>
      {/* Остальной контент в две колонки */}
      <div className="grid gap-4 md:grid-cols-[1fr_300px] md:gap-6 lg:grid-cols-[1fr_350px]">
        <div className="grid gap-4 md:gap-6">
          <OrderHistory order={order} />
        </div>
        <div className="grid gap-4 md:gap-6">
          <CustomerInfo order={order} />
          <ShippingAddressInfo order={order} />
          <PaymentInfo order={order} />
          <OrderActions order={order} />
        </div>
      </div>
      <OrderTabs order={order} />
    </div>
  );
}
