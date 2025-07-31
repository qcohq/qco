import { Skeleton } from "@/components/ui/skeleton";

export function ProductTypeAttributeTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 p-4 items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
