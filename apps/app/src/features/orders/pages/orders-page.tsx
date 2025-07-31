"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Input } from "@qco/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Package,
  Search,
  Truck,
  XCircle,
  RefreshCw,
  CheckSquare,
  XSquare,
} from "lucide-react";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { ORDER_STATUS_LABELS } from "@qco/db/schema";

import { OrdersDataTable } from "../components/orders-data-table";
import { OrdersTableSkeleton } from "../components/orders-table-skeleton";

export function OrdersPage() {
  const trpc = useTRPC();
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Запрос заказов
  const ordersQueryOptions = trpc.orders.list.queryOptions({
    limit: 50,
  });

  // Запрос статистики
  const statsQueryOptions = trpc.orders.stats.queryOptions();

  const { data: orders = [], isPending, error } = useQuery(ordersQueryOptions);
  const { data: stats, isPending: isStatsPending } =
    useQuery(statsQueryOptions);

  // Фильтрация заказов
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Обработчики
  const handleOrderSelectionChange = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrderIds((prev) => [...prev, orderId]);
    } else {
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "confirmed":
        return CheckCircle;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      case "refunded":
        return RefreshCw;
      default:
        return AlertCircle;
    }
  };

  const getStatusLabel = (status: string) => {
    return ORDER_STATUS_LABELS[status] || status;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Заказы</h1>
            <p className="text-sm text-muted-foreground">
              Управление заказами и отслеживание статусов
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 space-y-6 p-4 md:p-6">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего заказов
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.totalLast24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ожидают обработки
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.byStatus?.pending?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.pending?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В обработке</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending
                  ? "..."
                  : stats?.byStatus?.processing?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.processing?.last24h || 0} за последние 24
                часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доставлены</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending
                  ? "..."
                  : stats?.byStatus?.delivered?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.delivered?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Подтверждены
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.byStatus?.confirmed?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.confirmed?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отправлены</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.byStatus?.shipped?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.shipped?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отменены</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.byStatus?.cancelled?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.cancelled?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Возвраты</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isStatsPending ? "..." : stats?.byStatus?.refunded?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{stats?.byStatus?.refunded?.last24h || 0} за последние 24 часа
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Фильтры и поиск</CardTitle>
            <CardDescription>
              Найдите и отфильтруйте заказы по различным критериям
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по номеру заказа, клиенту или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="mr-2 h-4 w-4" />
                    Статус:{" "}
                    {statusFilter === "all"
                      ? "Все"
                      : getStatusLabel(statusFilter)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    Все статусы
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    {getStatusLabel("pending")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>
                    {getStatusLabel("confirmed")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("processing")}
                  >
                    {getStatusLabel("processing")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("shipped")}>
                    {getStatusLabel("shipped")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("delivered")}
                  >
                    {getStatusLabel("delivered")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    {getStatusLabel("cancelled")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("refunded")}
                  >
                    {getStatusLabel("refunded")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Список заказов</CardTitle>
                <CardDescription>
                  {filteredOrders.length} заказов найдено
                </CardDescription>
              </div>
              {selectedOrderIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Выбрано: {selectedOrderIds.length}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Массовые действия
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Массовые действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Статусы */}
                      <DropdownMenuItem>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Подтвердить выбранные
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        В обработку
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Truck className="mr-2 h-4 w-4" />
                        Отправить
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Доставлены
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <XSquare className="mr-2 h-4 w-4" />
                        Отменить
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Экспорт */}
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Экспорт в Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <OrdersTableSkeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ошибка загрузки</h3>
                <p className="text-muted-foreground mb-4">
                  Не удалось загрузить заказы: {error.message}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Попробовать снова
                </Button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Заказы не найдены
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Попробуйте изменить фильтры поиска"
                    : "Заказы появятся здесь после их создания"}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            ) : (
              <OrdersDataTable
                orders={filteredOrders}
                selectedOrderIds={selectedOrderIds}
                onSelectionChange={handleOrderSelectionChange}
                disabled={isPending}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
