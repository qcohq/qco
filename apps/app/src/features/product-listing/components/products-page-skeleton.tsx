import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@qco/ui/components/tabs";
import {
  AvatarSkeleton,
  ButtonSkeleton,
  TextSkeleton,
} from "./enhanced-skeleton";

export { PaginationSkeleton } from "./pagination-skeleton";
export { ProductFiltersSkeleton } from "./product-filters-skeleton";
// Re-export individual skeleton components
export { ProductTableSkeleton } from "./product-table-skeleton";

export function ProductsPageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between gap-4 border-b p-4">
        <TextSkeleton className="h-7 w-24" />
        <div className="flex items-center gap-2">
          <ButtonSkeleton className="h-9 w-20" />
          <ButtonSkeleton className="h-9 w-20" />
          <ButtonSkeleton className="h-9 w-32" />
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          {/* Filters Card Skeleton */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4">
                <ButtonSkeleton className="h-10 w-48" />
                <ButtonSkeleton className="h-10 w-32" />
                <ButtonSkeleton className="h-10 w-28" />
                <ButtonSkeleton className="h-10 w-24" />
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <ButtonSkeleton className="h-10 w-10" />
                <ButtonSkeleton className="h-10 w-10" />
                <ButtonSkeleton className="h-10 w-10" />
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            {/* Tabs Skeleton */}
            <Tabs value="table">
              <TabsList>
                <TabsTrigger value="table" disabled>
                  <Skeleton className="h-4 w-16" />
                </TabsTrigger>
                <TabsTrigger value="tile" disabled>
                  <Skeleton className="h-4 w-16" />
                </TabsTrigger>
                <TabsTrigger value="compact" disabled>
                  <Skeleton className="h-4 w-20" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Table Skeleton */}
            <Card className="overflow-hidden">
              <div className="p-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 border-b pb-3">
                  <div className="col-span-1">
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="col-span-3">
                    <TextSkeleton className="h-4 w-20" />
                  </div>
                  <div className="col-span-2">
                    <TextSkeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-2">
                    <TextSkeleton className="h-4 w-12" />
                  </div>
                  <div className="col-span-2">
                    <TextSkeleton className="h-4 w-16" />
                  </div>
                  <div className="col-span-1">
                    <TextSkeleton className="h-4 w-12" />
                  </div>
                  <div className="col-span-1">
                    <TextSkeleton className="h-4 w-16" />
                  </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 border-b py-3 last:border-b-0"
                  >
                    <div className="col-span-1">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <AvatarSkeleton className="h-12 w-12" />
                        <div className="flex flex-col gap-1">
                          <TextSkeleton className="h-4 w-32" />
                          <TextSkeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <TextSkeleton className="h-4 w-20" />
                    </div>
                    <div className="col-span-2">
                      <TextSkeleton className="h-4 w-16" />
                    </div>
                    <div className="col-span-2">
                      <TextSkeleton className="h-4 w-20" />
                    </div>
                    <div className="col-span-1">
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-1">
                        <ButtonSkeleton className="h-8 w-8" />
                        <ButtonSkeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between">
              <TextSkeleton className="h-4 w-32" />
              <div className="flex items-center gap-4">
                <ButtonSkeleton className="h-8 w-20" />
                <div className="flex items-center gap-1">
                  <ButtonSkeleton className="h-8 w-8" />
                  <ButtonSkeleton className="h-8 w-8" />
                  <ButtonSkeleton className="h-8 w-8" />
                  <ButtonSkeleton className="h-8 w-8" />
                  <ButtonSkeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Скелетон для карточек товаров (плиточный вид)
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <AvatarSkeleton className="h-16 w-16" />
              <div className="flex-1 space-y-2">
                <TextSkeleton className="h-4 w-3/4" />
                <TextSkeleton className="h-3 w-1/2" />
                <TextSkeleton className="h-3 w-1/3" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="flex items-center gap-1">
                <ButtonSkeleton className="h-8 w-8" />
                <ButtonSkeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Скелетон для компактного списка
export function CompactProductListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="p-3">
          <div className="flex items-center gap-3">
            <AvatarSkeleton className="h-12 w-12" />
            <div className="flex-1 space-y-1">
              <TextSkeleton className="h-4 w-48" />
              <TextSkeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex items-center gap-1">
              <ButtonSkeleton className="h-8 w-8" />
              <ButtonSkeleton className="h-8 w-8" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
