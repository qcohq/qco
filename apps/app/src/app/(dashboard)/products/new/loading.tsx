import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@qco/ui/components/tabs";

export default function LoadingNewProduct() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Шапка страницы */}
      <header className="flex h-14 shrink-0 items-center border-b px-4 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </header>

      {/* Основное содержимое */}
      <div className="flex flex-1 overflow-hidden max-w-full">
        {/* Основная форма */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-7 w-40" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Изображения */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Card className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md" />
                  <Skeleton className="aspect-square rounded-md hidden sm:block" />
                  <Skeleton className="aspect-square rounded-md hidden md:block" />
                  <Skeleton className="aspect-square rounded-md hidden lg:block" />
                </div>
              </Card>
            </div>

            {/* Атрибуты и варианты */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Card className="p-4">
                <Tabs defaultValue="attributes" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="attributes" disabled>
                      <Skeleton className="h-4 w-20" />
                    </TabsTrigger>
                    <TabsTrigger value="variants" disabled>
                      <Skeleton className="h-4 w-20" />
                    </TabsTrigger>
                  </TabsList>

                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="space-y-3">
                      <Skeleton className="h-32 w-full rounded-md" />
                      <Skeleton className="h-32 w-full rounded-md" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-40" />
                    </div>
                  </div>
                </Tabs>
              </Card>
            </div>

            {/* Цены и наличие */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* SEO и метаданные */}
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className="hidden lg:block w-[300px] border-l p-4 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Card className="p-4">
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-px w-full bg-border" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
