"use client";

import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsOverview } from "./analytics-overview";
import { SalesChart } from "./sales-chart";
import { TopProducts } from "./top-products";
import { CustomerMetrics } from "./customer-metrics";
import { RevenueMetrics } from "./revenue-metrics";

export function AnalyticsContent() {
    return (
        <div className="space-y-6">
            <AnalyticsHeader />

            <AnalyticsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <TopProducts />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomerMetrics />
                <RevenueMetrics />
            </div>
        </div>
    );
} 