"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import type { CustomerOrdersInput } from "@qco/validators";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";

// TODO: Использовать тип из схемы пропсов фильтров заказов клиента, если появится в @qco/validators
type CustomerOrdersFiltersProps = {
  filters: Omit<CustomerOrdersInput, "customerId">;
  onFiltersChange: (filters: Omit<CustomerOrdersInput, "customerId">) => void;
  total: number;
};

export function CustomerOrdersFilters({
  filters,
  onFiltersChange,
  total,
}: CustomerOrdersFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status:
        status === "all"
          ? undefined
          : (status as CustomerOrdersInput["status"]),
      offset: 0, // Сбрасываем пагинацию при изменении фильтров
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as CustomerOrdersInput["sortBy"],
      sortOrder: sortOrder as CustomerOrdersInput["sortOrder"],
      offset: 0,
    });
  };

  const handleLimitChange = (limit: string) => {
    onFiltersChange({
      ...filters,
      limit: Number.parseInt(limit),
      offset: 0,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      limit: 20,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = filters.status || searchQuery;

  return (
    <div className="space-y-4">
      {/* Основные фильтры */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по заказам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select
            value={filters.status ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="pending">Ожидает оплаты</SelectItem>
              <SelectItem value="processing">Обработка</SelectItem>
              <SelectItem value="shipped">Отправлен</SelectItem>
              <SelectItem value="delivered">Доставлен</SelectItem>
              <SelectItem value="cancelled">Отменен</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                Сортировка
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split("-");
                  handleSortChange(sortBy, sortOrder);
                }}
              >
                <DropdownMenuRadioItem value="createdAt-desc">
                  <SortDesc className="mr-2 h-4 w-4" />
                  Дата (новые)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="createdAt-asc">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Дата (старые)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="totalAmount-desc">
                  <SortDesc className="mr-2 h-4 w-4" />
                  Сумма (больше)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="totalAmount-asc">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Сумма (меньше)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status-asc">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Статус (А-Я)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={filters.limit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Очистить
            </Button>
          )}
        </div>
      </div>

      {/* Информация о результатах */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Найдено заказов: {total}
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Фильтры активны
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
