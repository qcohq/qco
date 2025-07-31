"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductTypeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex space-x-2 ml-auto">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
