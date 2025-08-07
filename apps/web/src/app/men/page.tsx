import BlogSection from "@/components/blog-section";
import HeroSection from "@/components/hero-section";
import { BrandsByCategory } from "@/features/brands";
import ProductGrid from "@/features/products/components/product-grid";

export default function MenPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection categorySlug="muzhchinam" />
        <ProductGrid categorySlug="muzhchinam" />
        <BrandsByCategory categorySlug="muzhchinam" />
        <BlogSection />
      </main>
    </div>
  );
}
