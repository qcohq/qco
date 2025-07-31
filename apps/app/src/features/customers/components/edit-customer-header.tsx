import { Button } from "@qco/ui/components/button";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";

// TODO: Использовать тип из схемы пропсов заголовка редактирования клиента, если появится в @qco/validators
interface EditCustomerHeaderProps {
  customerId: string;
  onDeleteClick: () => void;
}

export function EditCustomerHeader({
  customerId,
  onDeleteClick,
}: EditCustomerHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center border-b px-3 sm:h-16 sm:px-4 md:px-6">
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/customers/${customerId}`}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-lg font-semibold sm:text-xl">
          Редактирование клиента
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="destructive" size="sm" onClick={onDeleteClick}>
          <Trash className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Удалить клиента</span>
        </Button>
      </div>
    </header>
  );
}
