import BlogSection from "@/components/blog-section";
import CategoriesSection from "@/components/categories-section";
import HeroSection from "@/components/hero-section";
import { BrandsByCategory } from "@/features/brands";
import ProductGrid from "@/features/products/components/product-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection categorySlug="zhenschinam" />
        <CategoriesSection categorySlug="zhenschinam" />
        <BrandsByCategory categorySlug="zhenschinam" />
        <ProductGrid categorySlug="zhenschinam" />
        <BlogSection />
      </main>
    </div>
  );
}
