"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const customerData = [
    { name: "Новые клиенты", value: 234, color: "#8884d8" },
    { name: "Возвращающиеся", value: 456, color: "#82ca9d" },
    { name: "VIP клиенты", value: 123, color: "#ffc658" },
];

const customerMetrics = [
    { label: "Средний чек", value: "₽12,450" },
    { label: "Конверсия", value: "3.2%" },
    { label: "Удержание", value: "78%" },
    { label: "LTV", value: "₽45,600" },
];

export function CustomerMetrics() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Метрики клиентов</CardTitle>
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

                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={customerData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {customerData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 