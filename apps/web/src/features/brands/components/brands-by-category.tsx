"use client";

import { Button } from "@qco/ui/components/button";
import type { BrandListItem } from "@qco/web-validators";
import Link from "next/link";
import { useBrandsByCategory } from "../hooks/use-brands-by-category";
import { BrandsGrid } from "./brands-grid";
import { BrandsHeader } from "./brands-header";

interface BrandsByCategoryProps {
  categorySlug: string;
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  customTitle?: string;
  customDescription?: string;
  showHeader?: boolean;
}

// Функция для получения заголовка и описания по slug категории
function getCategoryInfo(categorySlug: string) {
  const categoryInfo = {
    zhenschinam: {
      title: "Наши бренды",
      description:
        "Мы гордимся сотрудничеством с ведущими мировыми домами моды, предлагая вам только лучшее.",
    },
    muzhchinam: {
      title: "Наши бренды",
      description:
        "Мы гордимся сотрудничеством с ведущими мировыми домами моды, предлагая вам только лучшее.",
    },
    detyam: {
      title: "Наши бренды",
      description:
        "Мы гордимся сотрудничеством с ведущими мировыми домами моды, предлагая вам только лучшее.",
    },
  };

  return (
    categoryInfo[categorySlug as keyof typeof categoryInfo] || {
      title: "Наши бренды",
      description:
        "Мы гордимся сотрудничеством с ведущими мировыми домами моды, предлагая вам только лучшее.",
    }
  );
}

export function BrandsByCategory({
  categorySlug,
  limit = 6,
  showViewAll = true,
  className = "",
  customTitle,
  customDescription,
  showHeader = true,
}: BrandsByCategoryProps) {
  const { brands, isLoading, error } = useBrandsByCategory({
    categorySlug,
    limit,
  });

  if (error || (!isLoading && (!brands || brands.length === 0))) {
    return null;
  }

  // Получаем информацию о категории
  const categoryInfo = getCategoryInfo(categorySlug);
  const title = customTitle || categoryInfo.title;
  const description = customDescription || categoryInfo.description;


  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {showHeader && (
          <BrandsHeader
            title={title}
            description={description}
            isLoading={isLoading}
          />
        )}

        <BrandsGrid
          brands={brands}
          isLoading={isLoading}
          error={error}
          className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        />

        {showViewAll && !isLoading && brands.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/brands">Смотреть все бренды</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
