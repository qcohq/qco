import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { TrendingUp } from "lucide-react";
import type { RevenueData, RevenueChartProps } from "@qco/validators";

export function RevenueChart({
  data = [],
  isLoading: _ = false,
}: RevenueChartProps) {
  const maxRevenue =
    data.length > 0
      ? Math.max(...data.map((d: RevenueData) => d.revenue))
      : 0;
  const totalRevenue = data.reduce(
    (sum: number, d: RevenueData) => sum + d.revenue,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Выручка за неделю
        </CardTitle>
        <CardDescription>
          Общая выручка: {totalRevenue.toLocaleString()} ₽
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">День</span>
            <span className="text-muted-foreground">Выручка</span>
          </div>
          <div className="space-y-3">
            {data.map((item: RevenueData) => {
              const percentage =
                maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={item.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.date}</span>
                    <span>{item.revenue.toLocaleString()} ₽</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
