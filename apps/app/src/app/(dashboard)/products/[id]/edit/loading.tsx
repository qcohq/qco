import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@qco/ui/components/tabs";

export default function ProductEditLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Шапка страницы */}
      <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Заголовок и действия */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Форма редактирования */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Основная форма */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <Tabs defaultValue="general">
                  <TabsList className="w-full justify-start rounded-none border-b px-4">
                    <TabsTrigger value="general" className="opacity-70">
                      Основное
                    </TabsTrigger>
                    <TabsTrigger value="images" className="opacity-70">
                      Изображения
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="opacity-70">
                      Цены
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="opacity-70">
                      Склад
                    </TabsTrigger>
                    <TabsTrigger value="attributes" className="opacity-70">
                      Атрибуты
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={`product-edit-skeleton-field-${i}-${Date.now()}`}
                          className="space-y-2"
                        >
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Tabs>
              </Card>

              <Card className="mt-6">
                <div className="space-y-4 p-6">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </Card>
            </div>

            {/* Предпросмотр и дополнительные настройки */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="border-b p-4">
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="bg-muted aspect-square w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="space-y-2 p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              </Card>

              <Card className="space-y-4 p-6">
                <Skeleton className="h-6 w-48" />

                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
