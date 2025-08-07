import { useRecommendedProducts } from "../hooks/use-recommended-products";
import ProductCard from "./product-card";

interface ProductRecommendationsProps {
  currentProductId: string;
  categorySlug?: string;
}

export default function ProductRecommendations({
  currentProductId,
  categorySlug,
}: ProductRecommendationsProps) {
  const { recommendedProducts, isLoading, error } = useRecommendedProducts({
    currentProductId,
    limit: 4,
    categorySlug,
  });

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
            Вам также может понравиться
          </h2>
          <p className="text-muted-foreground">
            Похожие товары из нашей коллекции
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-2">
          Вам также может понравиться
        </h2>
        <p className="text-muted-foreground">
          Похожие товары из нашей коллекции
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
