"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { name: "Янв", sales: 4000, orders: 2400 },
    { name: "Фев", sales: 3000, orders: 1398 },
    { name: "Мар", sales: 2000, orders: 9800 },
    { name: "Апр", sales: 2780, orders: 3908 },
    { name: "Май", sales: 1890, orders: 4800 },
    { name: "Июн", sales: 2390, orders: 3800 },
    { name: "Июл", sales: 3490, orders: 4300 },
];

export function SalesChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Продажи за последние 7 месяцев</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₽${value}`}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="Продажи"
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            name="Заказы"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 