"use client";
import { Card, CardContent } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function AdminsSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Admins table skeleton */}
                <div className="lg:col-span-2 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <Skeleton className="w-24 h-8 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                        <Skeleton className="h-3 w-1/3" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-6 w-16" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Summary skeleton */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 