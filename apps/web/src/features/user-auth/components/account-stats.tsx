"use client";

import { Badge } from "@qco/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Award,
  Loader2,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useAccountStats } from "../hooks/use-account-stats";

export function AccountStats() {
  const { stats, statsLoading, statsError } = useAccountStats();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка</CardTitle>
          <CardDescription>Не удалось загрузить статистику</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            {statsError.message || "Произошла ошибка при загрузке статистики"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      title: "Всего заказов",
      value: stats.orders.total,
      icon: ShoppingBag,
      description: "За все время",
      trend: null,
    },
    {
      title: "Потрачено в этом году",
      value: formatPrice(stats.orders.yearSpent),
      icon: TrendingUp,
      description: "2024 год",
      trend: "up",
    },
    {
      title: "Бонусные баллы",
      value: stats.bonusPoints,
      icon: Award,
      description: "Доступно баллов",
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.trend && (
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend === "up" ? "↗" : "↘"} +12%
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
