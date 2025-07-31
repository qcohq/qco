"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { CustomerHeader } from "@/features/customers/components/customer-header";
import { CustomerMainContent } from "@/features/customers/components/customer-main-content";
import { CustomerSidebar } from "@/features/customers/components/customer-sidebar";
import { DeleteCustomerDialog } from "@/features/customers/components/delete-customer-dialog";
import { ErrorMessage } from "~/components/error-message";
import { useCustomerQueries } from "../hooks/use-customer-queries";
import type { CustomerDetailPageProps } from "../types";

export function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    customer,
    isLoading,
    error,
    updateCustomer,
    deleteCustomer,
    isUpdating,
    isDeleting,
  } = useCustomerQueries(customerId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-500">Загрузка профиля клиента...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <ErrorMessage error={error} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Клиент не найден
          </h2>
          <p className="text-sm text-gray-500">
            Запрашиваемый клиент не существует
          </p>
        </div>
      </div>
    );
  }

  const handleDeleteClick = () => setIsDeleteDialogOpen(true);
  const handleDeleteConfirm = () => {
    deleteCustomer();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <DeleteCustomerDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            customerId={customerId}
            customerName={`${customer.firstName} ${customer.lastName}`}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <CustomerHeader
          customer={customer}
          customerId={customerId}
          onDeleteClick={handleDeleteClick}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
        />
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <CustomerMainContent
              customer={customer}
              onUpdateCustomer={updateCustomer}
              isUpdating={isUpdating}
            />
            <CustomerSidebar customer={customer} />
          </div>
        </div>
      </main>
    </div>
  );
}
