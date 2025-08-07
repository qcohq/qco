"use client";

import { SaleProductsGrid } from "@/features/sale-products/components/sale-products-grid";
import { SaleProductsHeader } from "@/features/sale-products/components/sale-products-header";
import { SaleProductsLoading } from "@/features/sale-products/components/sale-products-loading";
import { useSaleProductsData } from "@/features/sale-products/hooks/use-sale-products-data";

export default function WomenSalePage() {
    const { products, isLoading } = useSaleProductsData("women");

    if (isLoading) {
        return <SaleProductsLoading />;
    }

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <SaleProductsHeader category="women" />
                <SaleProductsGrid products={products || []} />
            </main></div>
    );
} 