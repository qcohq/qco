"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

export function BrandsLoading() {
  // Создаем массив из 12 элементов для скелетона
  const skeletonCards = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="w-full">
      {/* Скелетон для табов */}
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-9 rounded-lg bg-muted/50 px-8 py-2">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Skeleton className="h-10 w-full sm:w-[260px]" />
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>
      </div>

      {/* Скелетон для карточек */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {skeletonCards.map((index) => (
          <div key={index} className="overflow-hidden rounded-lg border">
            <div className="aspect-[4/3] w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4">
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-4 h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Скелетон для пагинации */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
      </div>
    </div>
  );
}
