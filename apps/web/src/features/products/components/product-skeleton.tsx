import { Skeleton } from "@qco/ui/components/skeleton";

function ProductSkeleton() {
  return (
    <div className="group relative">
      {/* Image skeleton */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="mt-4 space-y-2">
        {/* Brand skeleton */}
        <Skeleton className="h-3 w-16" />

        {/* Title skeleton */}
        <Skeleton className="h-4 w-full" />

        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export function ProductRowSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="flex gap-6 w-max">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="w-52 flex-shrink-0 first:ml-4 last:mr-4">
          <ProductSkeleton />
        </div>
      ))}
    </div>
  );
}

export { ProductSkeleton };
