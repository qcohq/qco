"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

export function BannerFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Заголовок секции */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-1 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Основная информация */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full md:w-1/2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>

      {/* Ссылки */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-1 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Таргетинг */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-1 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Изображения */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-1 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-6 w-1 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-4 pt-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
