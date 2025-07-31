"use client";

import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function CategoriesLoading() {
  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["total", "active", "inactive", "featured"].map((type) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-8 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4 space-y-2">
        <Skeleton className="h-10 w-full max-w-xs" />
      </div>

      <div className="space-y-2">
        {["item1", "item2", "item3", "item4", "item5"].map((item) => (
          <div key={item} className="rounded-lg border p-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
