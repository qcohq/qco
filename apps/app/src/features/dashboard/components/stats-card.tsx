import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

import type { StatsCardProps } from "@qco/validators";

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading = false,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          {description && <Skeleton className="h-3 w-24" />}
          {trend && <Skeleton className="h-3 w-16 mt-1" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span
              className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              с прошлого месяца
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
