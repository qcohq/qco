import Footer from "@/components/footer";
import { Skeleton } from "@qco/ui/components/skeleton";
import { CatalogSkeleton } from "./catalog-skeleton";

export function CatalogLoading() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Banners */}
        <div className="mb-8">
          <Skeleton className="h-32 w-full rounded-lg mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* New Products */}
        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <CatalogSkeleton count={8} showTitle={true} />
      </main>
      <Footer />
    </div>
  );
}
