"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  activeCategory?: string;
  activeSubcategory?: string;
}

interface Category {
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  name: string;
  slug: string;
  items?: string[];
}

const categories: Category[] = [
  {
    name: "Женщинам",
    slug: "women",
    subcategories: [
      { name: "Новинки", slug: "new" },
      {
        name: "Одежда",
        slug: "clothing",
        items: [
          "Платья",
          "Блузы",
          "Юбки",
          "Брюки",
          "Жакеты",
          "Пальто",
          "Свитеры",
          "Футболки",
        ],
      },
      {
        name: "Обувь",
        slug: "shoes",
        items: [
          "Туфли",
          "Сапоги",
          "Ботинки",
          "Кроссовки",
          "Санд����лии",
          "Лоферы",
        ],
      },
      {
        name: "Сумки",
        slug: "bags",
        items: ["Сумки через плечо", "Клатчи", "Рюкзаки", "Кошельки", "Тоуты"],
      },
      {
        name: "Аксессуары",
        slug: "accessories",
        items: ["Украшения", "Часы", "Шарфы", "Очки", "Ремни", "Перчатки"],
      },
      {
        name: "Красота",
        slug: "beauty",
        items: ["Парфюмерия", "Макияж", "Уход за кожей", "Уход за волосами"],
      },
    ],
  },
  {
    name: "Мужчинам",
    slug: "men",
    subcategories: [
      { name: "Новинки", slug: "new" },
      {
        name: "Одежда",
        slug: "clothing",
        items: [
          "Костюмы",
          "Рубашки",
          "Джинсы",
          "Свитеры",
          "Куртки",
          "Пальто",
          "Футболки",
        ],
      },
      {
        name: "Обувь",
        slug: "shoes",
        items: ["Ботинки", "Кроссовки", "Лоферы", "Сандалии", "Туфли"],
      },
      {
        name: "Аксессуары",
        slug: "accessories",
        items: ["Часы", "Ремни", "Кошельки", "Запонки", "Очки", "Галстуки"],
      },
    ],
  },
  {
    name: "Детям",
    slug: "kids",
    subcategories: [
      { name: "Новинки", slug: "new" },
      {
        name: "Девочкам",
        slug: "girls",
        items: ["Платья", "Блузы", "Юбки", "Брюки", "Верхняя одежда"],
      },
      {
        name: "Мальчикам",
        slug: "boys",
        items: ["Рубашки", "Брюки", "Свитеры", "Куртки", "Футболки"],
      },
      {
        name: "Обувь",
        slug: "shoes",
        items: ["Кроссовки", "Ботинки", "Сандалии", "Туфли"],
      },
    ],
  },
];

export default function CategorySidebar({
  activeCategory,
  activeSubcategory,
}: CategorySidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>(
    [],
  );

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug],
    );
  };

  const toggleSubcategory = (slug: string) => {
    setExpandedSubcategories((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug],
    );
  };

  // Auto-expand active category and subcategory
  useState(() => {
    if (activeCategory) {
      setExpandedCategories([activeCategory]);

      if (activeSubcategory) {
        setExpandedSubcategories([activeSubcategory]);
      }
    }
  });

  return (
    <div className="space-y-1">
      <h3 className="font-semibold mb-3">Категории</h3>

      <div className="space-y-1">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          const isExpanded = expandedCategories.includes(category.slug);

          return (
            <div key={category.slug} className="space-y-1">
              <div className="flex items-center justify-between">
                <Link
                  href={`/catalog/${category.slug}`}
                  className={cn(
                    "text-sm hover:text-foreground transition-colors flex-1",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {category.name}
                </Link>
                <button
                  onClick={() => toggleCategory(category.slug)}
                  className="p-1 rounded-md hover:bg-accent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="pl-4 space-y-1">
                  {category.subcategories.map((subcategory) => {
                    const isSubActive = activeSubcategory === subcategory.slug;
                    const isSubExpanded = expandedSubcategories.includes(
                      subcategory.slug,
                    );

                    return (
                      <div key={subcategory.slug} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/catalog/${category.slug}/${subcategory.slug}`}
                            className={cn(
                              "text-sm hover:text-foreground transition-colors flex-1",
                              isSubActive
                                ? "font-medium text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {subcategory.name}
                          </Link>
                          {subcategory.items && (
                            <button
                              onClick={() =>
                                toggleSubcategory(subcategory.slug)
                              }
                              className="p-1 rounded-md hover:bg-accent"
                            >
                              {isSubExpanded ? (
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              )}
                            </button>
                          )}
                        </div>

                        {isSubExpanded && subcategory.items && (
                          <div className="pl-3 space-y-1">
                            {subcategory.items.map((item) => (
                              <Link
                                key={item}
                                href={`/catalog/${category.slug}/${subcategory.slug}/${item.toLowerCase().replace(/\s+/g, "-")}`}
                                className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
