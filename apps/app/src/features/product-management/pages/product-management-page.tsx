"use client";

import { Suspense } from "react";
import { ProductEditFormContainer } from "../components/product-edit-form-container";
import { ProductEditFormLoading } from "../components/product-edit-form-loading";

interface ProductManagementPageProps {
    productId: string;
}

export function ProductManagementPage({ productId }: ProductManagementPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<ProductEditFormLoading />}>
                <ProductEditFormContainer productId={productId} />
            </Suspense>
        </div>
    );
} 