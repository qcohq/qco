import { Card } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Separator } from "@qco/ui/components/separator";

export function VariantsListSkeleton() {
    return (
        <section id="variants">
            <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>

                <Skeleton className="mt-1 mb-4 h-4 w-96" />

                <Separator className="my-4" />

                <div className="space-y-4">
                    {/* Skeleton для таблицы вариантов */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-8 w-24" />
                        </div>

                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                    <div className="ml-auto flex space-x-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skeleton для опций */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-8 w-28" />
                        </div>

                        <div className="space-y-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <Skeleton className="h-4 w-20" />
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                    <div className="ml-auto flex space-x-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
} 