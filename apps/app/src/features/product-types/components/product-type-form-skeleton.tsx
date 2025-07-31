"use client";

import { Card, CardContent } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductTypeFormSkeleton() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6 py-8">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-20 w-full" />
        <div className="flex justify-end pt-8">
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
