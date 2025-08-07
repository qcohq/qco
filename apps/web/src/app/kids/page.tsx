import BlogSection from "@/components/blog-section";
import HeroSection from "@/components/hero-section";
import { BrandsByCategory } from "@/features/brands";
import ProductGrid from "@/features/products/components/product-grid";

export default function KidsPage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection categorySlug="detyam" />
        <ProductGrid categorySlug="detyam" />
        <BrandsByCategory categorySlug="detyam" />
        <BlogSection />
      </main></div>
  );
}
