import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </Card>
  );
}
