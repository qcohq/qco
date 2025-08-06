"use client";

import { useStats } from "@/features/dashboard/hooks/use-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";

export function CustomerMetrics() {
    const { data, isLoading, error } = useStats();

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading customer metrics</div>;

    // Примерные метрики на основе API (LTV, удержание и средний чек требуют отдельного API)
    const customerMetrics = [
        { label: "Customers", value: data.customers.value.toLocaleString() },
        { label: "Customers Trend", value: `${data.customers.trend > 0 ? "+" : ""}${data.customers.trend}%` },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {customerMetrics.map((metric) => (
                        <div key={metric.label} className="text-center">
                            <p className="text-2xl font-bold">{metric.value}</p>
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                        </div>
                    ))}
                </div>
                {/* График временно скрыт, т.к. нет данных из API */}
            </CardContent>
        </Card>
    );
} 