"use client";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
}

interface CategoryBreadcrumbsProps {
  breadcrumbs: CategoryBreadcrumb[];
  currentCategory?: string;
}

export function CategoryBreadcrumbs({
  breadcrumbs,
  currentCategory,
}: CategoryBreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link
        href="/"
        className="flex items-center hover:text-gray-700 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((breadcrumb, _index) => (
        <div key={breadcrumb.id} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/catalog/${breadcrumb.slug}`}
            className="hover:text-gray-700 transition-colors"
          >
            {breadcrumb.name}
          </Link>
        </div>
      ))}

      {currentCategory && (
        <div className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{currentCategory}</span>
        </div>
      )}
    </nav>
  );
}
