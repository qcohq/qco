"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { CreateSuperAdminForm } from "./create-super-admin-form";

export function AdminSetupGuard({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();

  // Проверяем, есть ли администраторы в системе
  const {
    data: admins,
    isLoading,
    error,
  } = useQuery(trpc.admins.checkEmpty.queryOptions());

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Проверка системы...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-gray-600">
            {error.message || "Не удалось проверить состояние системы"}
          </p>
        </div>
      </div>
    );
  }

  // Если администраторов нет, показываем форму создания суперадмина
  if (admins?.isEmpty) {
    return <CreateSuperAdminForm />;
  }

  // Если администраторы есть, показываем обычный контент
  return <>{children}</>;
}
