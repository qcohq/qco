import type { ProductItem } from "@qco/web-validators";
import ProductCard from "@/features/products/components/product-card";

interface SaleProductsGridProps {
    products: ProductItem[];
}

export function SaleProductsGrid({ products }: SaleProductsGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    Пока нет товаров со скидкой в этой категории
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
} 