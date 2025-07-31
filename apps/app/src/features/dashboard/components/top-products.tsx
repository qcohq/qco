import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { TopProduct, TopProductsProps } from "@qco/validators";

export function TopProducts({
  products = [],
  isLoading = false,
}: TopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Топ продуктов
        </CardTitle>
        <CardDescription>
          Самые продаваемые товары за последний месяц
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`top-products-skeleton-${Date.now()}-${i}`}
                  className="flex items-center gap-3 p-3 border rounded-lg animate-pulse"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Нет данных о продуктах</p>
            </div>
          ) : (
            products.map((product: TopProduct, index: number) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {product.name || "Неизвестный продукт"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} продаж
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {product.revenue.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Посмотреть все продукты
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
