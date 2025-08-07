import { Suspense } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { BrandsAlphabetical, BrandsNavigation } from "@/features/brands";

// Skeleton компонент для fallback
function BrandsPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Skeleton для алфавитной навигации */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="h-6 w-48 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={`alphabet-skeleton-${index}`} className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
      </div>

      {/* Skeleton для брендов */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <div key={`brand-skeleton-${index}`} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Бренды", href: "/brands" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Все бренды</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-6">
            Откройте для себя мир роскошных брендов и эксклюзивных коллекций
          </p>

          <BrandsNavigation className="max-w-md mx-auto" />
        </div>

        <Suspense fallback={<BrandsPageSkeleton />}>
          <BrandsAlphabetical />
        </Suspense>
      </main>
    </div>
  );
}
