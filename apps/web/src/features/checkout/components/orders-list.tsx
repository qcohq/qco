"use client";

import { useState } from "react";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";
import { Input } from "@qco/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@qco/ui/components/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@qco/ui/components/pagination";
import { useOrdersList } from "../hooks/use-orders-list";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, Package, Calendar, User, CreditCard, Truck } from "lucide-react";

interface OrdersListProps {
    customerId?: string;
    className?: string;
}

const ORDER_STATUSES = [
    { value: "", label: "Все статусы" },
    { value: "pending", label: "Ожидает оплаты" },
    { value: "processing", label: "В обработке" },
    { value: "shipped", label: "Отправлен" },
    { value: "delivered", label: "Доставлен" },
    { value: "cancelled", label: "Отменен" },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case "pending":
            return { label: "Ожидает оплаты", color: "bg-yellow-100 text-yellow-800" };
        case "processing":
            return { label: "В обработке", color: "bg-blue-100 text-blue-800" };
        case "shipped":
            return { label: "Отправлен", color: "bg-purple-100 text-purple-800" };
        case "delivered":
            return { label: "Доставлен", color: "bg-green-100 text-green-800" };
        case "cancelled":
            return { label: "Отменен", color: "bg-red-100 text-red-800" };
        default:
            return { label: status, color: "bg-gray-100 text-gray-800" };
    }
};

export function OrdersList({ customerId, className }: OrdersListProps) {
    const [filters, setFilters] = useState({
        status: "",
        orderNumber: "",
        limit: 10,
        offset: 0,
    });

    const { orders, pagination, isLoading, error, refetch } = useOrdersList({
        ...filters,
        customerId,
    });

    const handlePageChange = (page: number) => {
        const newOffset = (page - 1) * filters.limit;
        setFilters(prev => ({ ...prev, offset: newOffset }));
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value, offset: 0 }));
    };

    const handleSearch = () => {
        refetch();
    };

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Ошибка при загрузке заказов: {error.message}</p>
                        <Button onClick={() => refetch()} variant="outline">
                            Попробовать снова
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={className}>
            {/* Фильтры */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Фильтры заказов
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Номер заказа</label>
                            <Input
                                placeholder="Поиск по номеру заказа"
                                value={filters.orderNumber}
                                onChange={(e) => handleFilterChange("orderNumber", e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Статус</label>
                            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите статус" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ORDER_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleSearch} className="w-full">
                                Найти
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Список заказов */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Заказы ({pagination.total})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-24 bg-gray-200 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Заказы не найдены</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                return (
                                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="font-semibold text-lg">Заказ #{order.orderNumber}</h3>
                                                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{format(new Date(order.createdAt), "dd MMM yyyy", { locale: ru })}</span>
                                                        </div>

                                                        {order.customer && (
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                <span>
                                                                    {order.customer.firstName} {order.customer.lastName}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" />
                                                            <span>{formatPrice(order.totalAmount)}</span>
                                                        </div>

                                                        {order.trackingNumber && (
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4" />
                                                                <span>{order.trackingNumber}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {order.items && order.items.length > 0 && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                Товары: {order.items?.length || 0} {(order.items?.length || 0) === 1 ? "шт." : "шт."}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {order.items.slice(0, 3).map((item) => (
                                                                    <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {item.productName} x{item.quantity}
                                                                    </span>
                                                                ))}
                                                                {(order.items?.length || 0) > 3 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        +{(order.items?.length || 0) - 3} еще
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Button variant="outline" size="sm">
                                                        Подробнее
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Пагинация */}
            {pagination.totalPages > 1 && (
                <div className="mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(page)}
                                            isActive={page === pagination.currentPage}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
} 