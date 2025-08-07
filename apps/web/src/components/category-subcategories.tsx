"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productsCount?: number;
  order?: number | null;
  isActive?: boolean;
  isFeatured?: boolean;
  children?: CategoryTree[];
}

interface CategorySubcategoriesProps {
  categories: CategoryTree[];
  columns?: number;
}

export function CategorySubcategories({
  categories,
  columns = 3,
}: CategorySubcategoriesProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Подкатегории не найдены</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/catalog/${category.slug}`}
          className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>

          {category.imageUrl && (
            <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          {category.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            {category.productsCount && category.productsCount > 0 && (
              <span className="text-sm text-gray-500">
                {category.productsCount} товаров
              </span>
            )}

            {category.isFeatured && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                HOT
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
