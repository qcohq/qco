"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <Skeleton className="h-9 w-64 mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Формы */}
          <div className="lg:col-span-2 space-y-6">
            {/* Контактная информация */}
            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-100">
              <Skeleton className="h-6 w-48 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
              </div>
            </div>

            {/* Адрес доставки */}
            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-200">
              <Skeleton className="h-6 w-40 animate-pulse" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full animate-pulse" />
                  <Skeleton className="h-10 w-full animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-10 w-full animate-pulse" />
                  <Skeleton className="h-10 w-full animate-pulse" />
                  <Skeleton className="h-10 w-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Способ доставки */}
            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-300">
              <Skeleton className="h-6 w-44 animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 space-y-3 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-32 animate-pulse" />
                        <Skeleton className="h-4 w-48 animate-pulse" />
                      </div>
                      <Skeleton className="h-4 w-16 animate-pulse" />
                    </div>
                    <Skeleton className="h-4 w-24 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Способ оплаты */}
            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-400">
              <Skeleton className="h-6 w-40 animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4 rounded-full animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-36 animate-pulse" />
                        <Skeleton className="h-4 w-48 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Юридические соглашения */}
            <div className="space-y-4 animate-in slide-in-from-left duration-700 delay-500">
              <Skeleton className="h-6 w-48 animate-pulse" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded animate-pulse" />
                    <Skeleton className="h-4 w-64 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка - Сводка заказа */}
          <div className="lg:col-span-1 animate-in slide-in-from-right duration-700 delay-200">
            <div className="border rounded-lg p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
              {/* Заголовок сводки */}
              <Skeleton className="h-6 w-32 animate-pulse" />

              {/* Товары в корзине */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex space-x-3 animate-in fade-in duration-500"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <Skeleton className="h-16 w-16 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full animate-pulse" />
                      <Skeleton className="h-4 w-24 animate-pulse" />
                      <Skeleton className="h-4 w-16 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Разделитель */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 animate-pulse" />
                  <Skeleton className="h-4 w-16 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 animate-pulse" />
                  <Skeleton className="h-4 w-16 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 animate-pulse" />
                  <Skeleton className="h-4 w-16 animate-pulse" />
                </div>
              </div>

              {/* Итого */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16 animate-pulse" />
                  <Skeleton className="h-6 w-20 animate-pulse" />
                </div>
              </div>

              {/* Кнопка оформления */}
              <Skeleton className="h-12 w-full rounded-lg animate-pulse bg-gradient-to-r from-gray-200 to-gray-300" />
            </div>

            {/* Уведомление о безопасности */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-in fade-in duration-700 delay-600">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <Skeleton className="h-4 w-32 bg-green-200 animate-pulse" />
              </div>
              <Skeleton className="h-3 w-full bg-green-200 animate-pulse" />
              <Skeleton className="h-3 w-3/4 mt-1 bg-green-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
