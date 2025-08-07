"use client";

import { Button } from "@qco/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";

interface CategoryNavigationProps {
  categoryData?: any;
  activeCategory?: string;
  activeSubcategory?: string;
  activeSubsubcategory?: string;
}

export default function CategoryNavigation({
  categoryData,
  activeCategory,
  activeSubcategory,
  activeSubsubcategory,
}: CategoryNavigationProps) {
  const trpc = useTRPC();
  const [isOpen, setIsOpen] = useState(true);

  // Получаем категории с товарами
  const categoriesQueryOptions = trpc.categories.getWithProducts.queryOptions();
  const { data: categories, isLoading } = useQuery(categoriesQueryOptions);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-semibold"
          >
            <span>Категории</span>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {categories?.map((category: any) => (
            <div key={category.id} className="space-y-1">
              <Link
                href={`/catalog/${category.slug}`}
                className={`block px-2 py-1 rounded text-sm transition-colors ${
                  activeCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {category.name}
              </Link>

              {/* Показываем подкатегории только для активной категории */}
              {activeCategory === category.slug &&
                category.children?.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {category.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={`/catalog/${child.slug}`}
                        className={`block px-2 py-1 rounded text-sm transition-colors ${
                          activeSubcategory === child.slug
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
