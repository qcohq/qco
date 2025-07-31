"use client";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import {
  useRecentOrders,
  useRevenueChart,
  useStats,
  useTopProducts,
} from "../hooks";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { QuickActions } from "./quick-actions";
import { RecentOrders } from "./recent-orders";
import { RevenueChart } from "./revenue-chart";
import { StatsCard } from "./stats-card";
import { TopProducts } from "./top-products";

export function DashboardContent() {
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: ordersData, isLoading: ordersLoading } = useRecentOrders();
  const { data: productsData, isLoading: productsLoading } = useTopProducts();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();

  // Show skeleton if any data is loading
  const isLoading = statsLoading || ordersLoading || productsLoading || revenueLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = [
    {
      title: "Total Revenue",
      value: statsData ? `${statsData.revenue.value.toLocaleString()} ₽` : "0 ₽",
      description: "Last month",
      icon: DollarSign,
      trend: statsData
        ? {
          value: statsData.revenue.trend,
          isPositive: statsData.revenue.trend >= 0,
        }
        : undefined,
      isLoading: statsLoading,
    },
    {
      title: "Orders",
      value: statsData ? statsData.orders.value.toLocaleString() : "0",
      description: "New orders",
      icon: ShoppingCart,
      trend: statsData
        ? {
          value: statsData.orders.trend,
          isPositive: statsData.orders.trend >= 0,
        }
        : undefined,
      isLoading: statsLoading,
    },
    {
      title: "Products",
      value: statsData ? statsData.products.value.toLocaleString() : "0",
      description: "Active products",
      icon: Package,
      trend: statsData
        ? {
          value: statsData.products.trend,
          isPositive: statsData.products.trend >= 0,
        }
        : undefined,
      isLoading: statsLoading,
    },
    {
      title: "Customers",
      value: statsData ? statsData.customers.value.toLocaleString() : "0",
      description: "Registered",
      icon: Users,
      trend: statsData
        ? {
          value: statsData.customers.trend,
          isPositive: statsData.customers.trend >= 0,
        }
        : undefined,
      isLoading: statsLoading,
    },
  ];

  return (
    <div className="flex flex-col">
      <DashboardHeader />

      <main className="flex-1 p-6">
        {/* Statistics */}
        <section className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
        </section>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            <RevenueChart data={revenueData || []} isLoading={revenueLoading} />
            <TopProducts
              products={productsData || []}
              isLoading={productsLoading}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <RecentOrders orders={ordersData || []} isLoading={ordersLoading} />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
