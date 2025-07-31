import { Avatar, AvatarFallback } from "@qco/ui/components/avatar";
import { Badge } from "@qco/ui/components/badge";
import { Calendar, Mail, Phone, ShoppingBag } from "lucide-react";
import type { Customer } from "../types";

// TODO: Использовать тип из схемы пропсов карточки информации о клиенте, если появится в @qco/validators
type CustomerInfoCardProps = {
  customer: Customer;
};

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Основная информация
          </h2>
          <p className="text-sm text-gray-500">
            Личные данные и статистика клиента
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gray-100">
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials(`${customer.firstName} ${customer.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-primary">
                    {customer.customerCode}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              {customer.orders?.length ?? 0} заказов
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />С{" "}
              {new Date(customer.createdAt).toLocaleDateString("ru-RU")}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
