"use client";

import type { RouterOutputs } from "@qco/web-api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useTRPC } from "@/trpc/react";

type Category = RouterOutputs["categories"]["getRoot"][number];
type ChildCategory = RouterOutputs["categories"]["getChildrenByParentSlug"][number];

interface CategoriesSectionProps {
  categorySlug?: string;
}

export default function CategoriesSection({ categorySlug }: CategoriesSectionProps) {
  const trpc = useTRPC();

  // Создаем опции запроса в зависимости от наличия categorySlug
  const categoriesQueryOptions = categorySlug
    ? trpc.categories.getChildrenByParentSlug.queryOptions({ parentSlug: categorySlug })
    : trpc.categories.getRoot.queryOptions();

  // Используем опции с хуком useQuery
  const {
    data: categories,
    isPending,
    error,
  } = useQuery(categoriesQueryOptions);

  if (isPending) {
    return (
      <section className="py-[10] bg-white border-black border-t-0">
        <div className="container mx-auto px-2.5 my-0 bg-white">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3.5 mt-5">
              {categorySlug ? "Подкатегории" : "Категории"}
            </h2>
            <p className="text-muted-foreground">
              {categorySlug
                ? "Исследуйте подкатегории"
                : "Исследуйте наши коллекции по категориям"
              }
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-0">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className="aspect-[3/2] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-[10] bg-white border-black border-t-0">
        <div className="container mx-auto px-2.5 my-0 bg-white">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3.5 mt-5">
              {categorySlug ? "Подкатегории" : "Категории"}
            </h2>
            <p className="text-muted-foreground">
              {categorySlug ? "Ошибка загрузки подкатегорий" : "Ошибка загрузки категорий"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[10] bg-white border-black border-t-0">
      <div className="container mx-auto px-2.5 my-0 bg-white">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3.5 mt-5">
            {categorySlug ? "Подкатегории" : "Категории"}
          </h2>
          <p className="text-muted-foreground">
            {categorySlug
              ? "Исследуйте подкатегории"
              : "Исследуйте наши коллекции по категориям"
            }
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 py-0">
          {categories?.map((category: Category | ChildCategory) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="group relative overflow-hidden rounded-lg aspect-[3/2]"
            >
              <Image
                src={
                  category.image?.url || "/placeholder.svg?height=300&width=400"
                }
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <h3 className="text-white text-sm md:text-base text-center font-medium">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
