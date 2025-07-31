import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@qco/ui/components/tabs";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

export default function ProductsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Шапка страницы */}
      <header className="flex h-16 shrink-0 items-center border-b px-4 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Товары</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1 opacity-70">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Фильтры</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1 opacity-70">
            <Search className="h-4 w-4" />
            <span>Поиск</span>
          </Button>
          <Button size="sm" className="h-9 gap-1 opacity-70">
            <Plus className="h-4 w-4" />
            <span>Добавить товар</span>
          </Button>
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Вкладки и статистика */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all" className="opacity-70">
                  Все товары
                </TabsTrigger>
                <TabsTrigger value="active" className="opacity-70">
                  Активные
                </TabsTrigger>
                <TabsTrigger value="draft" className="opacity-70">
                  Черновики
                </TabsTrigger>
                <TabsTrigger value="archived" className="opacity-70">
                  Архив
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Сетка товаров */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card
                key={`product-list-skeleton-${i}-${Date.now()}`}
                className="overflow-hidden flex flex-col"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>

          {/* Пагинация */}
          <div className="flex items-center justify-between pt-4">
            <Skeleton className="h-9 w-32" />
            <div className="flex gap-1">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
