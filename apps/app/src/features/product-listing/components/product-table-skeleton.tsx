import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductTableSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 border-b pb-3">
          <div className="col-span-1">
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="col-span-3">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="col-span-2">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="col-span-1">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 border-b py-3 last:border-b-0"
          >
            <div className="col-span-1">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <div className="col-span-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
