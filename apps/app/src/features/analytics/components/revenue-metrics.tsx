"use client";

import { useRevenueChart } from "@/features/dashboard/hooks/use-revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueMetrics() {
    const { data, isLoading, error } = useRevenueChart();

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading revenue metrics</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium mb-3">Revenue by Day</h4>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={(value) => `₽${value / 1000}k`} />
                                    <Tooltip formatter={(value: number) => [`₽${value.toLocaleString()}`, "Revenue"]} />
                                    <Bar dataKey="revenue" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Детализация по категориям временно скрыта, т.к. нет данных из API */}
                </div>
            </CardContent>
        </Card>
    );
} 