"use client";

import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { TrendingDown, TrendingUp, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";

function MetricCard({ title, value, change, isPositive, icon: Icon }: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change}
                </p>
            </CardContent>
        </Card>
    );
}

export function AnalyticsOverview() {
    const { data, isLoading, error } = useDashboardStats();

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading analytics overview</div>;

    const metrics = [
        {
            title: "Total Revenue",
            value: `₽${data.revenue.value.toLocaleString()}`,
            change: `${data.revenue.trend > 0 ? "+" : ""}${data.revenue.trend}%`,
            isPositive: data.revenue.trend >= 0,
            icon: DollarSign,
        },
        {
            title: "Orders",
            value: data.orders.value.toLocaleString(),
            change: `${data.orders.trend > 0 ? "+" : ""}${data.orders.trend}%`,
            isPositive: data.orders.trend >= 0,
            icon: ShoppingCart,
        },
        {
            title: "Customers",
            value: data.customers.value.toLocaleString(),
            change: `${data.customers.trend > 0 ? "+" : ""}${data.customers.trend}%`,
            isPositive: data.customers.trend >= 0,
            icon: Users,
        },
        {
            title: "Products",
            value: data.products.value.toLocaleString(),
            change: `${data.products.trend > 0 ? "+" : ""}${data.products.trend}%`,
            isPositive: data.products.trend >= 0,
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