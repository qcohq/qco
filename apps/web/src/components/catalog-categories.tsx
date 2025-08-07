"use client";

import { Badge } from "@qco/ui/components/badge";
import { Card, CardContent } from "@qco/ui/components/card";
import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  itemCount?: number;
  isNew?: boolean;
}

interface CatalogCategoriesProps {
  title: string;
  description?: string;
  categories: CategoryItem[];
  basePath: string;
}

export default function CatalogCategories({
  title,
  description,
  categories,
  basePath,
}: CatalogCategoriesProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`${basePath}/${category.slug}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {category.isNew && (
                      <Badge className="bg-black text-white">Новинка</Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-white/80 mb-2">
                        {category.description}
                      </p>
                    )}
                    {category.itemCount && (
                      <p className="text-xs text-white/70">
                        {category.itemCount} товаров
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
