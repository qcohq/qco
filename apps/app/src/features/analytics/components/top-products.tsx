"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";

const topProducts = [
    {
        id: 1,
        name: "Nike Air Max 270",
        category: "Обувь",
        sales: 234,
        revenue: 234000,
        growth: "+12.5%",
    },
    {
        id: 2,
        name: "Adidas Ultraboost",
        category: "Обувь",
        sales: 189,
        revenue: 189000,
        growth: "+8.2%",
    },
    {
        id: 3,
        name: "Puma RS-X",
        category: "Обувь",
        sales: 156,
        revenue: 156000,
        growth: "+15.3%",
    },
    {
        id: 4,
        name: "New Balance 574",
        category: "Обувь",
        sales: 134,
        revenue: 134000,
        growth: "+5.7%",
    },
    {
        id: 5,
        name: "Converse Chuck Taylor",
        category: "Обувь",
        sales: 123,
        revenue: 123000,
        growth: "+9.1%",
    },
];

export function TopProducts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Топ продуктов по продажам</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">₽{product.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-muted-foreground">{product.sales} продаж</p>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.growth}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 