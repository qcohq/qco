"use client";

import { Skeleton } from "@qco/ui/components/skeleton";
import { Card, CardContent } from "@qco/ui/components/card";

interface ProductCardSkeletonProps {
    viewMode?: "grid" | "list";
}

function ProductCardSkeleton({ viewMode = "grid" }: ProductCardSkeletonProps) {
    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                        {/* Изображение */}
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto">
                            <Skeleton className="w-full h-full rounded-none" />

                            {/* Badges */}
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                                <Skeleton className="h-5 w-12 rounded-full" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>

                        {/* Контент */}
                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                            <div className="mb-2">
                                <Skeleton className="h-3 w-20 mb-2" />
                                <Skeleton className="h-5 w-3/4 mb-1" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>

                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-3 w-2/3 mb-3" />

                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>

                            <div className="mt-auto flex gap-2">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
                {/* Изображение */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <Skeleton className="w-full h-full" />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>

                    {/* Кнопка избранного */}
                    <div className="absolute top-2 right-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>

                {/* Контент */}
                <div className="p-3 sm:p-4">
                    {/* Бренд */}
                    <Skeleton className="h-3 w-16 mb-2" />

                    {/* Название */}
                    <div className="mb-2">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Цена */}
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Рейтинг */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-3 w-3 rounded-sm" />
                            ))}
                        </div>
                        <Skeleton className="h-3 w-8" />
                    </div>

                    {/* Кнопка */}
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
            </CardContent>
        </Card>
    );
}

interface CatalogSkeletonProps {
    count?: number;
    viewMode?: "grid" | "list";
    showTitle?: boolean;
}

export function CatalogSkeleton({
    count = 8,
    viewMode = "grid",
    showTitle = true
}: CatalogSkeletonProps) {
    return (
        <div className="mb-8">
            {showTitle && (
                <div className="mb-4">
                    <Skeleton className="h-7 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            )}

            <div className={`grid gap-4 sm:gap-6 ${viewMode === "list"
                    ? "grid-cols-1"
                    : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}>
                {Array.from({ length: count }).map((_, i) => (
                    <ProductCardSkeleton key={i} viewMode={viewMode} />
                ))}
            </div>
        </div>
    );
}

export { ProductCardSkeleton }; 