"use client";

import { Button } from "@qco/ui/components/button";
import type { CustomerOrdersInput } from "@qco/validators";
import { useState } from "react";
import { useCustomerOrders } from "../hooks/use-customer-orders";
import { CustomerOrdersFilters } from "./customer-orders-filters";
import { CustomerOrdersMobileList } from "./customer-orders-mobile-list";
import { CustomerOrdersPagination } from "./customer-orders-pagination";
import { CustomerOrdersStats } from "./customer-orders-stats";
import { CustomerOrdersTable } from "./customer-orders-table";

// TODO: Использовать тип из схемы пропсов секции заказов клиента, если появится в @qco/validators
type CustomerOrdersSectionProps = {
  customerId: string;
};

export function CustomerOrdersSection({
  customerId,
}: CustomerOrdersSectionProps) {
  const [filters, setFilters] = useState<
    Omit<CustomerOrdersInput, "customerId">
  >({
    limit: 20,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { orders, total, hasMore, isLoading, error } = useCustomerOrders(
    customerId,
    filters,
  );
  console.log(error);

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil(total / filters.limit);

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * filters.limit;
    setFilters((prev) => ({
      ...prev,
      offset: newOffset,
    }));
  };

  const handleFiltersChange = (
    newFilters: Omit<CustomerOrdersInput, "customerId">,
  ) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">
            Ошибка при загрузке заказов: {error.message}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            История заказов
          </h3>
          <p className="text-sm text-gray-500">Всего заказов: {total}</p>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-6 border-b border-gray-100">
        <CustomerOrdersStats orders={orders} isLoading={isLoading} />
      </div>

      {/* Фильтры */}
      <div className="p-6 border-b border-gray-100">
        <CustomerOrdersFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          total={total}
        />
      </div>

      {/* Таблица заказов */}
      <div className="hidden sm:block">
        <CustomerOrdersTable orders={orders} isLoading={isLoading} />
      </div>

      {/* Мобильный список заказов */}
      <div className="block sm:hidden">
        <CustomerOrdersMobileList orders={orders} isLoading={isLoading} />
      </div>

      {/* Пагинация */}
      {total > 0 && (
        <div className="p-6 border-t border-gray-100">
          <CustomerOrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
