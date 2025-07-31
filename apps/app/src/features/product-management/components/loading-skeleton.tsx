import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export function ProductManagementSkeleton() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50">
            {/* Header skeleton */}
            <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="ml-auto">
                    <Skeleton className="h-8 w-24" />
                </div>
            </header>

            {/* Content skeleton */}
            <div className="flex-1">
                <div className="container mx-auto max-w-4xl px-4 py-6">
                    <div className="space-y-8">
                        {/* Info card skeleton */}
                        <Card className="border-blue-200 bg-blue-50 p-6">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-96" />
                                </div>
                            </div>
                        </Card>

                        {/* Basic info section skeleton */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-1" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            </div>

                            <Card className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-52" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-32 w-full" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                            </Card>
                        </section>

                        {/* Pricing section skeleton */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-1" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-60" />
                                </div>
                            </div>

                            <Card className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-3 w-52" />
                                    </div>
                                </div>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
