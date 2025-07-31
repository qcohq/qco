import { Calendar, Mail, MapPin, Phone, ShoppingBag, User } from "lucide-react";
import type { CustomerSidebarProps } from "../types";

// TODO: Использовать тип из схемы пропсов сайдбара клиента, если появится в @qco/validators

export function CustomerSidebar({ customer }: CustomerSidebarProps) {
  // Получаем основной адрес из customer.addresses
  const primaryAddress = customer.addresses?.find((addr) => addr.isPrimary);

  return (
    <div className="space-y-6">
      {/* Контактная информация */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-primary rounded-full" />
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Контактная информация
            </h3>
            <p className="text-xs text-gray-500">Основные контакты клиента</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">ФИО</p>
                <p className="text-sm text-gray-600">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                <span className="text-xs font-semibold text-orange-600">#</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Код клиента</p>
                <p className="text-sm text-gray-600 font-mono">
                  {customer.customerCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50">
                  <Phone className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Телефон</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
              </div>
            )}

            {primaryAddress && (
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Основной адрес
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{primaryAddress.addressLine1}</p>
                    <p>
                      {primaryAddress.city}, {primaryAddress.postalCode}
                    </p>
                    <p>{primaryAddress.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 bg-primary rounded-full" />
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Статистика
            </h3>
            <p className="text-xs text-gray-500">Активность клиента</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
                  <ShoppingBag className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Заказов</p>
                  <p className="text-sm text-gray-600">Всего выполнено</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {customer.orders?.length ?? 0}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Регистрация
                  </p>
                  <p className="text-sm text-gray-600">Дата создания</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
