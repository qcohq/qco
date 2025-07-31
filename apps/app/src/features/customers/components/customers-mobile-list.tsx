"use client";

import type { RouterOutputs } from "@qco/api";
import { Avatar, AvatarFallback } from "@qco/ui/components/avatar";
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
  Calendar,

  Mail,
  MoreHorizontal,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteCustomerDialog } from "@/features/customers/components/delete-customer-dialog";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы данных клиента, если появится в @qco/validators
type Customer = RouterOutputs["customers"]["getAll"]["items"][number];

export function CustomersMobileList({ customers }: { customers: Customer[] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  function getInitials(customer: Customer) {
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";
    const name = customer.name || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "??";
  }

  function getName(customer: Customer) {
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim();
    }
    return customer.name ?? "—";
  }

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

  const handleDeleteClick = (customer: Customer) => {
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
    <div className="divide-y">
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

      {customers.map((customer) => (
        <div key={customer.id} className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="mt-1 h-10 w-10">
                <AvatarFallback>{getInitials(customer)}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/customers/${customer.id}`}
                  className="block font-medium hover:underline"
                >
                  {getName(customer)}
                </Link>
                <div className="text-muted-foreground mt-0.5 flex items-center text-xs">
                  <Mail className="mr-1 h-3 w-3" />
                  <span className="max-w-[180px] truncate">
                    {customer.email}
                  </span>
                </div>
                <div className="text-muted-foreground mt-0.5 flex items-center text-xs">
                  <Phone className="mr-1 h-3 w-3" />
                  <span>{customer.phone || "—"}</span>
                </div>
                <div className="text-muted-foreground mt-0.5 flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    С {new Date(customer.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {customer.totalOrders} заказов
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {Number(customer.totalSpent).toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                    })}
                  </Badge>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      ))}
    </div>
  );
}
