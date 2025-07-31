"use client";

import type { RouterOutputs } from "@qco/api";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteCustomerDialog } from "@/features/customers/components/delete-customer-dialog";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов таблицы клиентов, если появится в @qco/validators
type CustomersTableProps = {
  customers: RouterOutputs["customers"]["getAll"]["items"];
};

export function CustomersTable({
  customers,
}: CustomersTableProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  function formatDate(dateString?: string) {
    if (!dateString) return "—";
    try {
      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  }

  function getName(
    customer: RouterOutputs["customers"]["getAll"]["items"][number],
  ) {
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
    }
    return customer.name ?? "—";
  }

  const [customerToDelete, setCustomerToDelete] = useState<
    RouterOutputs["customers"]["getAll"]["items"][number] | null
  >(null);

  // Создаем опции мутации для удаления клиента
  const deleteCustomerMutationOptions = trpc.customers.delete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка клиентов
      queryClient.invalidateQueries({
        queryKey: trpc.customers.getAll.queryKey(),
      });

      toast.success("Клиент удален", {
        description: "Клиент успешно удален из системы",
      });

      setCustomerToDelete(null);
    },
    onError: (error) => {
      toast.error("Ошибка при удалении", {
        description: error.message || "Не удалось удалить клиента",
      });
    },
  });

  // Используем опции с хуком useMutation
  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation(
    deleteCustomerMutationOptions,
  );

  const handleDeleteClick = (
    customer: RouterOutputs["customers"]["getAll"]["items"][number],
  ) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteClose = () => {
    setCustomerToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer({ id: customerToDelete.id });
    }
  };

  return (
    <>
      {customerToDelete && (
        <DeleteCustomerDialog
          isOpen={!!customerToDelete}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          customerId={customerToDelete.id}
          customerName={getName(customerToDelete)}
          isDeleting={isDeleting}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Телефон</TableHead>
            <TableHead className="hidden md:table-cell">
              Дата регистрации
            </TableHead>
            <TableHead className="hidden text-right md:table-cell">
              Заказов
            </TableHead>
            <TableHead className="hidden text-right md:table-cell">
              Сумма
            </TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map(
            (
              customer: RouterOutputs["customers"]["getAll"]["items"][number],
            ) => (
              <TableRow key={customer.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="hover:underline"
                  >
                    {getName(customer)}
                  </Link>
                </TableCell>
                <TableCell>{customer.email || "—"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.phone || "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(customer.createdAt.toISOString())}
                </TableCell>
                <TableCell className="hidden text-right md:table-cell">
                  <Badge variant="secondary">{customer.totalOrders}</Badge>
                </TableCell>
                <TableCell className="hidden text-right md:table-cell font-medium">
                  {Number(customer.totalSpent).toLocaleString("ru-RU", {
                    style: "currency",
                    currency: "RUB",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Открыть меню</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/${customer.id}`}>
                          Просмотр профиля
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/customers/${customer.id}/edit`}>
                          Редактировать
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Добавить заметку</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteClick(customer)}
                      >
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </>
  );
}
