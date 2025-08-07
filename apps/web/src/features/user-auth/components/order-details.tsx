"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useOrderById } from "../hooks/use-orders";

const getStatusIcon = (status: string) => {
    switch (status) {
        case "processing":
            return <Clock className="h-4 w-4" />;
        case "shipped":
            return <Truck className="h-4 w-4" />;
        case "delivered":
            return <CheckCircle className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "processing":
            return "bg-yellow-100 text-yellow-800";
        case "shipped":
            return "bg-blue-100 text-blue-800";
        case "delivered":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case "processing":
            return "Обрабатывается";
        case "shipped":
            return "В пути";
        case "delivered":
            return "Доставлен";
        case "cancelled":
            return "Отменен";
        default:
            return status;
    }
};

const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
        return "Дата не указана";
    }

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
            return "Некорректная дата";
        }

        return new Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(dateObj);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Ошибка форматирования даты";
    }
};

interface OrderDetailsProps {
    orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
    const { data: order, isLoading, error } = useOrderById(orderId);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Ошибка при загрузке деталей заказа. Пожалуйста, попробуйте позже.
                </AlertDescription>
            </Alert>
        );
    }

    if (!order) {
        return (
            <Alert>
                <AlertDescription>
                    Заказ не найден.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Order Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">
                                Заказ #{order.orderNumber}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Создан {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">
                                    {getStatusText(order.status)}
                                </span>
                            </Badge>
                            <p className="text-2xl font-bold mt-2">
                                {order.totalAmount.toLocaleString("ru-RU")} ₽
                            </p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Товары в заказе</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    {item.slug ? (
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="font-medium hover:underline text-lg"
                                        >
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-lg">
                                            {item.name}
                                        </span>
                                    )}
                                    {item.sku && (
                                        <p className="text-sm text-muted-foreground">
                                            SKU: {item.sku}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Количество: {item.quantity}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {item.price.toLocaleString("ru-RU")} ₽
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Итого: {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>История заказа</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <div>
                                <p className="font-medium">Заказ создан</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>

                        {order.shippedAt && (
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                <div>
                                    <p className="font-medium">Заказ отправлен</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(order.shippedAt)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {order.deliveredAt && (
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                <div>
                                    <p className="font-medium">Заказ доставлен</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(order.deliveredAt)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Tracking Information */}
            {order.trackingNumber && (
                <Card>
                    <CardHeader>
                        <CardTitle>Информация об отслеживании</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">Номер отслеживания</p>
                                <p className="text-lg font-mono bg-gray-100 p-2 rounded">
                                    {order.trackingNumber}
                                </p>
                            </div>
                            {order.trackingUrl && (
                                <Button asChild>
                                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                                        <Truck className="h-4 w-4 mr-2" />
                                        Отследить посылку
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Shipping Address */}
            {order.shippingAddress && (
                <Card>
                    <CardHeader>
                        <CardTitle>Адрес доставки</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {order.shippingAddress.addressLine1 && (
                                <p>{order.shippingAddress.addressLine1}</p>
                            )}
                            {order.shippingAddress.addressLine2 && (
                                <p>{order.shippingAddress.addressLine2}</p>
                            )}
                            {order.shippingAddress.city && (
                                <p>{order.shippingAddress.city}</p>
                            )}
                            {order.shippingAddress.postalCode && (
                                <p>{order.shippingAddress.postalCode}</p>
                            )}
                            {order.shippingAddress.country && (
                                <p>{order.shippingAddress.country}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 