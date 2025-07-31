"use client";

import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Input } from "@qco/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomerFilters } from "@/features/customers/components/customer-filters";
import { CustomersMobileList } from "@/features/customers/components/customers-mobile-list";
import { CustomersTable } from "@/features/customers/components/customers-table";
import { CustomersTableSkeleton } from "@/features/customers/components/customers-table-skeleton";
import { useTRPC } from "~/trpc/react";

export function CustomersListPage() {
  const trpc = useTRPC();

  // Состояние для фильтров, поиска и пагинации
  const [search, setSearch] = useState("");
  const [page, _setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({
    customerGroup: "",
    registrationDate: null as Date | null,
    orderCountMin: undefined as number | undefined,
    orderCountMax: undefined as number | undefined,
    spentAmountMin: undefined as number | undefined,
    spentAmountMax: undefined as number | undefined,
    showActive: true,
    showInactive: true,
    isVip: undefined as boolean | undefined,
  });

  const customersQueryOptions = trpc.customers.getAll.queryOptions({
    page,
    limit,
    search: search || undefined,
    ...filters,
  });
  const { data, isPending, error } = useQuery(customersQueryOptions);

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Клиенты</h1>
          <p className="text-muted-foreground">
            Управляйте клиентами вашего магазина
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
          <Button size="sm" asChild>
            <Link href="/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              Добавить клиента
            </Link>
          </Button>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск клиентов..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Фильтры
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[220px]">
              <CustomerFilters filters={filters} onFiltersChange={setFilters} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Статистика */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Всего клиентов: {data?.meta?.total ?? 0}</span>
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-lg border bg-card">
        {isPending ? (
          <CustomersTableSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center p-8 text-destructive">
            <p>Ошибка загрузки: {error.message}</p>
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <CustomersTable customers={data?.items ?? []} />
            </div>
            <div className="block sm:hidden">
              <CustomersMobileList customers={data?.items ?? []} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
