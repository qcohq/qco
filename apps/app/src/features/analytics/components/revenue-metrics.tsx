"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
    { month: "Янв", revenue: 450000, orders: 45 },
    { month: "Фев", revenue: 520000, orders: 52 },
    { month: "Мар", revenue: 380000, orders: 38 },
    { month: "Апр", revenue: 610000, orders: 61 },
    { month: "Май", revenue: 480000, orders: 48 },
    { month: "Июн", revenue: 550000, orders: 55 },
];

const revenueBreakdown = [
    { category: "Обувь", revenue: 1200000, percentage: 45 },
    { category: "Одежда", revenue: 800000, percentage: 30 },
    { category: "Аксессуары", revenue: 400000, percentage: 15 },
    { category: "Спортивный инвентарь", revenue: 280000, percentage: 10 },
];

export function RevenueMetrics() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Детализация выручки</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium mb-3">Выручка по месяцам</h4>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `₽${value / 1000}k`} />
                                    <Tooltip
                                        formatter={(value: number) => [`₽${value.toLocaleString()}`, "Выручка"]}
                                    />
                                    <Bar dataKey="revenue" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-3">Выручка по категориям</h4>
                        <div className="space-y-3">
                            {revenueBreakdown.map((item) => (
                                <div key={item.category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` }}
                                        />
                                        <span className="text-sm">{item.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">₽{item.revenue.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 