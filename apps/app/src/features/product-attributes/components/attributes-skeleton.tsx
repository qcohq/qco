"use client";

import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function AttributesSkeleton() {
  // Создаем массив с уникальными идентификаторами для атрибутов
  const attributeIds = ["attr1", "attr2", "attr3", "attr4", "attr5"];

  return (
    <div className="space-y-6">
      {/* Скелетон информации о типе продукта */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardContent>
      </Card>

      {/* Скелетон списка атрибутов */}
      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {attributeIds.map((id) => (
            <div
              key={`attribute-skeleton-${id}`}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
