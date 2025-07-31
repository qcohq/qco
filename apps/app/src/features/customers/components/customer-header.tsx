import { Button } from "@qco/ui/components/button";
import { ArrowLeft, Edit, Trash, User } from "lucide-react";
import Link from "next/link";
import type { CustomerHeaderProps } from "../types";

export function CustomerHeader({
  customer,
  customerId,
  onDeleteClick,
  isDeleting,
  isUpdating,
}: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к клиентам
          </Link>
        </Button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              Профиль клиента • Код: {customer.customerCode}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/customers/${customerId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteClick}
          disabled={isDeleting || isUpdating}
        >
          <Trash className="mr-2 h-4 w-4" />
          Удалить
        </Button>
      </div>
    </div>
  );
}
