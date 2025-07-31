"use client";

import { Suspense } from "react";
import { ProductsPageContent } from "../components/products-page-content";
import { ProductsPageSkeleton } from "../components/products-page-skeleton";

export function ProductListingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<ProductsPageSkeleton />}>
                <ProductsPageContent />
            </Suspense>
        </div>
    );
} 