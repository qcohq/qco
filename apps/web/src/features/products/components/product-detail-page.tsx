"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Skeleton } from "@qco/ui/components/skeleton";
import { AlertCircle } from "lucide-react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/breadcrumbs";
import { useProductBySlug } from "../hooks/use-product-by-slug";
import { useProductCategoryHierarchy } from "../hooks/use-product-category-hierarchy";
import ProductDetail from "./product-detail";

interface ProductDetailPageProps {
  slug?: string;
}

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { product, isLoading, error } = useProductBySlug(slug);
  const { categoryHierarchy, isLoading: isHierarchyLoading } =
    useProductCategoryHierarchy(slug);

  // Создаем хлебную крошку для продукта
  const getBreadcrumbItems = () => {
    const items: BreadcrumbItem[] = [{ label: "Главная", href: "/" }];

    // Добавляем иерархию категорий продукта
    if (categoryHierarchy && categoryHierarchy.length > 0) {
      categoryHierarchy.forEach((category, index) => {
        // Для последней категории не добавляем ссылку (текущая страница)
        if (index === categoryHierarchy.length - 1) {
          items.push({ label: category.name, href: undefined });
        } else {
          // Для остальных категорий добавляем ссылки на соответствующие страницы
          items.push({
            label: category.name,
            href: `/catalog/${category.slug}`,
          });
        }
      });
    }

    return items;
  };

  // Создаем хлебную крошку для состояния загрузки
  const getLoadingBreadcrumbItems = () => [
    { label: "Главная", href: "/" },
    { label: "Загрузка..." },
  ];

  if (isLoading || isHierarchyLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Breadcrumbs items={getLoadingBreadcrumbItems()} />
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
          <div>
            <Skeleton className="w-full h-80 sm:h-96 rounded-lg" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <Skeleton className="h-6 sm:h-8 w-3/4" />
            <Skeleton className="h-4 sm:h-6 w-1/2" />
            <Skeleton className="h-8 sm:h-12 w-1/3" />
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Breadcrumbs items={getLoadingBreadcrumbItems()} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Произошла ошибка при загрузке продукта"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Breadcrumbs items={getLoadingBreadcrumbItems()} />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Продукт не найден</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <Breadcrumbs items={getBreadcrumbItems()} />
      <ProductDetail product={product} slug={slug} />
    </div>
  );
}
