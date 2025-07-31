"use client";

import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col">
            {/* Header skeleton */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center px-4">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </div>

            <main className="flex-1 p-6">
                {/* Statistics skeleton */}
                <section className="mb-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Card key={`stats-skeleton-${index}-${Date.now()}`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-4" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-8 w-20 mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16 mt-1" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Main content skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Left column */}
                    <div className="space-y-6">
                        {/* Revenue chart skeleton */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <Skeleton className="h-4 w-8" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="space-y-3">
                                        {Array.from({ length: 7 }).map((_, index) => (
                                            <div key={`revenue-skeleton-${index}-${Date.now()}`} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <Skeleton className="h-4 w-12" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                                <Skeleton className="w-full h-2 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top products skeleton */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div
                                            key={`top-products-skeleton-${index}-${Date.now()}`}
                                            className="flex items-center gap-3 p-3 border rounded-lg"
                                        >
                                            <Skeleton className="w-8 h-8 rounded-full" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-3/4 mb-2" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-10 w-full mt-4" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Recent orders skeleton */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div
                                            key={`recent-orders-skeleton-${index}-${Date.now()}`}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Skeleton className="h-4 w-16" />
                                                    <Skeleton className="h-5 w-20" />
                                                </div>
                                                <Skeleton className="h-3 w-24 mb-1" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                            <div className="text-right">
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-10 w-full mt-4" />
                            </CardContent>
                        </Card>

                        {/* Quick actions skeleton */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <Skeleton key={`quick-actions-skeleton-${index}-${Date.now()}`} className="h-10 w-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
} 