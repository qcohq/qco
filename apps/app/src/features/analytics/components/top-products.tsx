"use client";

import { useTopProducts } from "@/features/dashboard/hooks/use-top-products";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";

export function TopProducts() {
    const { data, isLoading, error } = useTopProducts();

    if (isLoading) return <div>Loading...</div>;
    if (error || !data) return <div>Error loading top products</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Products by Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                    {/* <p className="text-sm text-muted-foreground">{product.category}</p> */}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">₽{product.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                    {/* growth не приходит из API, поэтому убираем */}
                                    {/* <Badge variant="secondary" className="text-xs">{product.growth}</Badge> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 