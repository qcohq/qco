import { Skeleton } from "@qco/ui/components/skeleton";
import { CatalogSkeleton } from "@/features/catalog/components/catalog-skeleton";

export function SaleProductsLoading() {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Products grid skeleton */}
                <CatalogSkeleton count={8} showTitle={false} />
            </main>
        </div>
    );
} 