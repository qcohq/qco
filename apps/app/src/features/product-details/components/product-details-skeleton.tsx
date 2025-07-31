"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductDetailsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Skeleton для галереи */}
            <div className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-16 rounded-md" />
                    ))}
                </div>
            </div>

            {/* Skeleton для информации о продукте */}
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-12" />
                </div>

                <Skeleton className="h-px w-full" />

                <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-32" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            <Skeleton className="h-6 w-40" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-16 mb-1" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 