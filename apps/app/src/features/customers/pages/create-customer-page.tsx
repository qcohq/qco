import { Button } from "@qco/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateCustomerForm } from "@/features/customers/components/create-customer-form";

export function CreateCustomerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Шапка страницы */}
      <header className="flex h-14 shrink-0 items-center border-b px-3 sm:h-16 sm:px-4 md:px-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Назад</span>
            </Link>
          </Button>
          <h1 className="text-lg font-semibold sm:text-xl">
            Создание нового клиента
          </h1>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 p-3 sm:p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <CreateCustomerForm />
        </div>
      </main>
    </div>
  );
}
