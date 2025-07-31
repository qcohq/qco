"use client";

import { Card, CardContent } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

// TODO: Использовать тип из схемы пропсов скелетона формы категории, если появится в @qco/validators
export function CategoryFormSkeleton() {
    return (
        <div className="space-y-8">
            {/* Основная информация skeleton */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-48" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-56" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Изображение категории skeleton */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-52" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Дополнительные настройки skeleton */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-44" />
                        <Skeleton className="h-4 w-60" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-6 w-11" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-44" />
                            </div>
                            <Skeleton className="h-6 w-11" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* SEO настройки skeleton */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-28" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-3 w-44" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Кнопки skeleton */}
            <div className="flex justify-between gap-4 pt-6">
                <Skeleton className="h-10 w-32" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
        </div>
    );
} 