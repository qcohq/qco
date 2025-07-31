"use client";

import { Button } from "@qco/ui/components/button";
import { Plus, UserPlus } from "lucide-react";

// TODO: Использовать тип из схемы пропсов заголовка страницы админов, если появится в @qco/validators

export function AdminPageHeader({
  onCreateClick,
  onInviteClick,
}: {
  onCreateClick: () => void;
  onInviteClick: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Администраторы
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Управление администраторами системы
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={onInviteClick}
          className="w-full sm:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Пригласить
        </Button>
        <Button onClick={onCreateClick} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </div>
    </div>
  );
}
