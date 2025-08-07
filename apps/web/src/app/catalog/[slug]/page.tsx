import { Skeleton } from "@qco/ui/components/skeleton";
import { Suspense } from "react";
import CatalogPageLayout from "@/features/products/components/catalog-page-layout";
import { CategoryBreadcrumbs } from "@/features/products/components/category-breadcrumbs";
import { CatalogSkeleton } from "@/features/catalog/components/catalog-skeleton";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Разбираем slug для определения категории и подкатегории
  // Формат может быть: "zhenshchinam" или "zhenshchinam-odezhda"
  const slugParts = slug.split("-");
  let category = slugParts[0];
  let subcategory: string | undefined;

  // Если есть несколько частей, то это может быть подкатегория
  if (slugParts.length > 1) {
    // Проверяем, является ли первая часть известной категорией
    const knownCategories = [
      "zhenshchinam",
      "muzhchinam",
      "detyam",
    ];
    if (knownCategories.includes(category)) {
      subcategory = slugParts.slice(1).join("-");
    } else {
      // Если первая часть не известная категория, то весь slug - это категория
      category = slug;
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<BreadcrumbsSkeleton />}>
          <CategoryBreadcrumbs
            categorySlug={category}
            subcategorySlug={subcategory}
          />
        </Suspense>
        <Suspense fallback={<CategoryPageSkeleton />}>
          <CatalogPageLayout category={category} subcategory={subcategory} />
        </Suspense>
      </main>
    </div>
  );
}

function BreadcrumbsSkeleton() {
  return (
    <div className="flex items-center space-x-2 mb-8">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function CategoryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Заголовок категории */}
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Фильтры и сортировка */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        {/* Боковая панель с фильтрами */}
        <div className="hidden lg:block space-y-8">
          {/* Фильтр по цене */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Фильтр по брендам */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* Фильтр по размерам */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-16" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Основной контент с продуктами */}
        <div className="lg:col-span-3">
          <CatalogSkeleton count={9} showTitle={false} />
        </div>
      </div>
    </div>
  );
}
