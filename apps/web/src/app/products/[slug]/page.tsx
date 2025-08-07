import ProductDetailPage from "@/features/products/components/product-detail-page";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      <ProductDetailPage slug={slug} />
    </div>
  );
}
