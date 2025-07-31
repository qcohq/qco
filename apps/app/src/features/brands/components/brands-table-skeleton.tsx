"use client";

import { Checkbox } from "@qco/ui/components/checkbox";

// TODO: Использовать тип из схемы пропсов скелетона таблицы брендов, если появится в @qco/validators

export function BrandsTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-[50px] px-4 py-3 text-left text-xs font-medium">
                <Checkbox disabled />
              </th>
              <th className="w-[60px] px-4 py-3 text-left text-xs font-medium">
                Логотип
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Название
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Категории
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-medium md:table-cell">
                Описание
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Дата создания
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Год основания
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Страна
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Статус
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium">
                Избранное
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: rows }).map((_, index) => (
              <tr
                key={`brand-skeleton-${Date.now()}-${index}`}
                className="animate-pulse"
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <div className="h-4 w-4 bg-muted rounded" />
                </td>

                {/* Logo */}
                <td className="px-4 py-3">
                  <div className="h-10 w-10 bg-muted rounded-lg" />
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                </td>

                {/* Categories */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-5 w-20 bg-muted rounded-full" />
                  </div>
                </td>

                {/* Description */}
                <td className="hidden px-4 py-3 md:table-cell">
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                </td>

                {/* Created At */}
                <td className="px-4 py-3">
                  <div className="h-4 w-20 bg-muted rounded" />
                </td>

                {/* Founded Year */}
                <td className="px-4 py-3">
                  <div className="h-4 w-12 bg-muted rounded" />
                </td>

                {/* Country */}
                <td className="px-4 py-3">
                  <div className="h-4 w-16 bg-muted rounded" />
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                </td>

                {/* Featured */}
                <td className="px-4 py-3">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-8 w-8 bg-muted rounded" />
                    <div className="h-8 w-8 bg-muted rounded" />
                    <div className="h-8 w-8 bg-muted rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
