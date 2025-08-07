import { Suspense } from "react";
import { BrandDetailPage, BrandBreadcrumbs, BrandPageSkeleton } from "@/features/brands";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <BrandBreadcrumbs slug={slug} />
        <Suspense fallback={<BrandPageSkeleton />}>
          <BrandDetailPage slug={slug} />
        </Suspense>
      </main>
    </div>
  );
}
