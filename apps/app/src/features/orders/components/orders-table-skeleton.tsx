import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { useIsMobile } from "@/features/orders/hooks/use-is-mobile";

export function OrdersTableSkeleton() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="w-full overflow-x-hidden p-2 sm:p-3">
        <div className="space-y-2 sm:space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="w-full overflow-hidden">
              <div className="bg-muted/30 flex h-8 items-center justify-between border-b px-2 py-2 sm:h-10 sm:px-3">
                <Skeleton className="h-4 w-20 sm:h-5 sm:w-24" />
                <Skeleton className="h-4 w-14 sm:h-5 sm:w-16" />
              </div>
              <div className="p-2 sm:p-3">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <Skeleton className="h-5 w-full sm:h-6" />
                  <Skeleton className="h-5 w-full sm:h-6" />
                  <Skeleton className="h-5 w-full sm:h-6" />
                  <Skeleton className="h-5 w-full sm:h-6" />
                </div>
              </div>
              <div className="bg-muted/20 flex h-7 items-center justify-between border-t px-2 py-1.5 sm:h-8 sm:px-3 sm:py-2">
                <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
                <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full p-3 sm:p-4">
      <div className="space-y-2 sm:space-y-3">
        <Skeleton className="h-7 w-full sm:h-8" />
        <Skeleton className="h-14 w-full sm:h-16" />
        <Skeleton className="h-14 w-full sm:h-16" />
        <Skeleton className="h-14 w-full sm:h-16" />
        <Skeleton className="h-14 w-full sm:h-16" />
        <Skeleton className="h-14 w-full sm:h-16" />
      </div>
    </div>
  );
}
