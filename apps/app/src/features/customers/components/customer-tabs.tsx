import type { RouterOutputs } from "@qco/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { Activity, FileText } from "lucide-react";
import type { Customer } from "../types";
import { CustomerActivity } from "./customer-activity";
import { CustomerNotes } from "./customer-notes";
import { CustomerOrdersSection } from "./customer-orders-section";

// TODO: Использовать тип из схемы пропсов вкладок клиента, если появится в @qco/validators
type CustomerTabsProps = {
  customer: Customer;
  onUpdateCustomer: (
    data: RouterOutputs["customers"]["update"]["customer"],
  ) => void;
  isUpdating: boolean;
};

export function CustomerTabs({
  customer,
  onUpdateCustomer,
  isUpdating,
}: CustomerTabsProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Детальная информация
          </h2>
          <p className="text-sm text-gray-500">
            Заказы, активность и заметки клиента
          </p>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
          <TabsTrigger
            value="orders"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Activity className="h-4 w-4" />
            Заказы
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <Activity className="h-4 w-4" />
            Активность
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="flex items-center gap-2 data-[state=active]:bg-white"
          >
            <FileText className="h-4 w-4" />
            Заметки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <CustomerOrdersSection customerId={customer.id} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <CustomerActivity customerId={customer.id} />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <CustomerNotes
              customerId={customer.id}
              onUpdateCustomer={onUpdateCustomer}
              isUpdating={isUpdating}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
