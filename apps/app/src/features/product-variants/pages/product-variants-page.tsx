"use client";

import { Suspense } from "react";
import { VariantsListSection } from "../components/variants-list-section";
import { VariantsListSkeleton } from "../components/variants-list-skeleton";

interface ProductVariantsPageProps {
    productId: string;
}

export function ProductVariantsPage({ productId }: ProductVariantsPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<VariantsListSkeleton />}>
                <VariantsListSection productId={productId} />
            </Suspense>
        </div>
    );
} 