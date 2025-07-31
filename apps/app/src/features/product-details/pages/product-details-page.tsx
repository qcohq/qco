"use client";

import { Suspense } from "react";
import { ProductDetails } from "../components/product-details";
import { ProductDetailsSkeleton } from "../components/product-details-skeleton";
import { useProductDetails } from "../hooks/use-product-details";

interface ProductDetailsPageProps {
    productId: string;
}

export function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
    const { product, isLoading, error } = useProductDetails(productId);

    if (isLoading) {
        return <ProductDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
                    <p className="text-muted-foreground">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
                    <p className="text-muted-foreground">The requested product could not be found.</p>
                </div>
            </div>
        );
    }

    return <ProductDetails product={product} />;
}

// Серверный компонент-обертка
export function ProductDetailsPageServer({ productId }: ProductDetailsPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<ProductDetailsSkeleton />}>
                <ProductDetailsPage productId={productId} />
            </Suspense>
        </div>
    );
} 