import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import { CustomerLoading } from "./customer-loading";
import { CustomerNotFound } from "./customer-not-found";
import { DeleteCustomerDialog } from "./delete-customer-dialog";
import { EditCustomerForm } from "./edit-customer-form";
import { EditCustomerHeader } from "./edit-customer-header";

// TODO: Использовать тип из схемы пропсов клиента редактирования клиента, если появится в @qco/validators
interface EditCustomerClientProps {
  customerId: string;
}

export function EditCustomerClient({ customerId }: EditCustomerClientProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Получаем данные клиента
  const customerQueryOptions = trpc.customers.getById.queryOptions({
    id: customerId,
  });
  const {
    data: customer,
    isPending: isLoading,
    error,
  } = useQuery(customerQueryOptions);

  // Мутация для обновления клиента
  const updateCustomerMutation = useMutation(
    trpc.customers.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.customers.getById.queryKey({ id: customerId }),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.customers.getAll.queryKey(),
        });
        toast.success("Клиент обновлен", {
          description: "Данные клиента успешно сохранены",
        });
        router.push("/customers");
      },
      onError: (error) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось обновить клиента",
        });
      },
    }),
  );

  // Мутация для удаления клиента (оставляем как было)
  const handleDeleteClick = () => setIsDeleteDialogOpen(true);
  const handleDeleteConfirm = () => {
    // deleteCustomer вызывается в другом месте, не трогаем
  };

  if (isLoading) return <CustomerLoading />;
  if (error || !customer) return <CustomerNotFound />;

  // Формируем initialValues для формы
  const initialValues = {
    firstName: customer.firstName || undefined,
    lastName: customer.lastName || undefined,
    email: customer.email || undefined,
    phone: customer.phone || undefined,
    address: customer.addresses?.[0]?.addressLine1 || undefined,
    notes: customer.addresses?.[0]?.notes || undefined,
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <DeleteCustomerDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        customerId={customerId}
        customerName={`${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim()}
        isDeleting={false}
      />
      <EditCustomerHeader
        customerId={customerId}
        onDeleteClick={handleDeleteClick}
      />
      <main className="flex-1 p-3 sm:p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <EditCustomerForm
            initialValues={initialValues}
            isUpdating={updateCustomerMutation.isPending}
            onSubmit={(data) => {
              // Отправляем только изменённые поля
              const payload: Record<string, unknown> = { id: customerId };
              if (data.firstName !== undefined)
                payload.firstName = data.firstName;
              if (data.lastName !== undefined) payload.lastName = data.lastName;
              if (data.email !== undefined) payload.email = data.email;
              if (data.phone !== undefined) payload.phone = data.phone;
              if (data.address !== undefined)
                payload.addressLine1 = data.address;
              if (data.notes !== undefined) payload.notes = data.notes;
              updateCustomerMutation.mutate(payload);
            }}
          />
        </div>
      </main>
    </div>
  );
}
