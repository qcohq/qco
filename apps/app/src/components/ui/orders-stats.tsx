"use client";


import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { useOrdersStats } from "~/hooks/use-orders-stats";
import { Package, TrendingUp } from "lucide-react";

export const OrdersStats = React.memo(function OrdersStats() {
    const { newOrdersCount, ordersLast24h, newOrdersLast24h, isLoading } = useOrdersStats();

    if (isLoading) {
        return (
            <div className="space-y-4 p-4">
                <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            <Card className="border-0 bg-sidebar-accent/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-sidebar-foreground">
                        Новые заказы
                    </CardTitle>
                    <Package className="h-3 w-3 text-sidebar-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold text-sidebar-foreground">
                        {newOrdersCount}
                    </div>
                    <p className="text-xs text-sidebar-muted-foreground">
                        +{newOrdersLast24h} за 24ч
                    </p>
                </CardContent>
            </Card>

            <Card className="border-0 bg-sidebar-accent/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-sidebar-foreground">
                        Всего заказов
                    </CardTitle>
                    <TrendingUp className="h-3 w-3 text-sidebar-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold text-sidebar-foreground">
                        {ordersLast24h}
                    </div>
                    <p className="text-xs text-sidebar-muted-foreground">
                        за последние 24 часа
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}); 