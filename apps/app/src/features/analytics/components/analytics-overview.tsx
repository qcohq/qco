"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { TrendingDown, TrendingUp, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ title, value, change, isPositive, icon: Icon }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                    ) : (
                        <TrendingDown className="h-3 w-3" />
                    )}
                    {change}
                </p>
            </CardContent>
        </Card>
    );
}

export function AnalyticsOverview() {
    const metrics = [
        {
            title: "Общая выручка",
            value: "₽2,345,678",
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
        },
        {
            title: "Заказы",
            value: "1,234",
            change: "+8.2%",
            isPositive: true,
            icon: ShoppingCart,
        },
        {
            title: "Клиенты",
            value: "567",
            change: "+15.3%",
            isPositive: true,
            icon: Users,
        },
        {
            title: "Товары",
            value: "890",
            change: "-2.1%",
            isPositive: false,
            icon: Package,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </div>
    );
} 