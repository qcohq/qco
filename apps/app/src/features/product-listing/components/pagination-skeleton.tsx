import { Skeleton } from "@qco/ui/components/skeleton";

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
