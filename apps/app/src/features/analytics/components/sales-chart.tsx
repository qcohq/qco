"use client";

import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesChart() {
    const { data, isLoading, error } = useRevenueChart();

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading sales chart</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales for the Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="date"
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
                            dataKey="revenue"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="Revenue"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
} 