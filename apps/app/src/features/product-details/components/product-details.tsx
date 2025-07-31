"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Separator } from "@qco/ui/components/separator";
import { ProductGallery } from "./product-gallery";
import {
    type ProductDetailsProps,
    productDetailsSchema,
    type ColorImage
} from "../types";
import { formatPrice } from "@/lib/utils";
import { isProductOnSale, getCurrentPrice, getOriginalPrice } from "../utils/price-utils";

export function ProductDetails({ product }: ProductDetailsProps) {
    // Валидация входных данных
    const validationResult = productDetailsSchema.safeParse({ product });

    if (!validationResult.success) {
        console.error("ProductDetails validation error:", validationResult.error);
        return (
            <div className="flex items-center justify-center p-8 text-red-500">
                Invalid product data
            </div>
        );
    }

    const { product: validatedProduct } = validationResult.data;

    // Преобразуем файлы продукта в формат для галереи
    const galleryImages: ColorImage[] = validatedProduct.files?.map((file, index) => ({
        url: file.url,
        color: file.color || "default",
        isDefault: index === 0,
    })) || [];

    // Используем утилиты для работы с ценами
    const onSale = isProductOnSale(validatedProduct);
    const currentPrice = getCurrentPrice(validatedProduct);
    const originalPrice = getOriginalPrice(validatedProduct);

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Галерея изображений */}
            <div>
                <ProductGallery
                    images={galleryImages}
                    productName={validatedProduct.name}
                />
            </div>

            {/* Информация о продукте */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{validatedProduct.name}</h1>
                    {validatedProduct.description && (
                        <p className="mt-2 text-muted-foreground">{validatedProduct.description}</p>
                    )}
                </div>

                {/* Цена */}
                <div className="flex items-center gap-2">
                    {currentPrice && (
                        <span className="text-2xl font-bold">
                            {formatPrice(currentPrice)}
                        </span>
                    )}
                    {originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                    {onSale && (
                        <Badge variant="destructive" className="ml-2">
                            Sale
                        </Badge>
                    )}
                </div>

                <Separator />

                {/* Действия */}
                <div className="flex gap-4">
                    <Button size="lg" className="flex-1">
                        Add to Cart
                    </Button>
                    <Button size="lg" variant="outline">
                        Add to Wishlist
                    </Button>
                </div>

                {/* Дополнительная информация */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">SKU:</span>
                                <span className="ml-2 text-muted-foreground">
                                    {validatedProduct.sku || "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Stock:</span>
                                <span className="ml-2 text-muted-foreground">
                                    {validatedProduct.stock || "N/A"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 