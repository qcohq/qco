"use client";

import { Input } from "@qco/ui/components/input";
import { cn } from "@qco/ui/lib/utils";

// TODO: Использовать тип из схемы пропсов фильтров категорий, если появится в @qco/validators
export function CategoryFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (value: "all" | "active" | "inactive") => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      <Input
        placeholder="Поиск категорий..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-xs"
      />
      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as "all" | "active" | "inactive")
        }
        className={cn(
          "rounded border px-2 py-1",
          statusFilter === "all" ? "text-gray-500" : "",
        )}
      >
        <option value="all">Все</option>
        <option value="active">Активные</option>
        <option value="inactive">Неактивные</option>
      </select>
    </div>
  );
}
