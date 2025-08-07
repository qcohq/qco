"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import type { BrandListItem, FeaturedBrand } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTRPC } from "@/trpc/react";

interface BrandsPageProps {
  category?: "women" | "men" | "kids";
}

export default function BrandsPage({ category }: BrandsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const trpc = useTRPC();

  // Создаем опции запроса для получения всех брендов
  const brandsQueryOptions = trpc.brands.getAll.queryOptions({
    page: 1, // currentPage, // Получаем больше брендов для фильтрации
    limit: 100, // Получаем больше брендов для фильтрации
    search: searchQuery || undefined,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Используем опции с хуком useQuery
  const { data: brandsData, isPending, error } = useQuery(brandsQueryOptions);

  // Создаем опции запроса для получения избранных брендов
  const featuredBrandsQueryOptions = trpc.brands.getFeatured.queryOptions({
    limit: 15,
  });

  // Используем опции с хуком useQuery для избранных брендов
  const { data: featuredBrands, isPending: isFeaturedPending } = useQuery(
    featuredBrandsQueryOptions,
  );

  // Обработка ошибок
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">
          Ошибка загрузки брендов: {error.message}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  // Показываем загрузку
  if (isPending || isFeaturedPending) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Загрузка брендов...</p>
      </div>
    );
  }

  // Получаем бренды из данных API
  const allBrands: BrandListItem[] = brandsData?.brands || [];
  const featuredBrandsList: FeaturedBrand[] = featuredBrands || [];

  // Фильтруем бренды по категории (если нужно)
  const filteredBrands = allBrands.filter((brand: BrandListItem) => {
    const matchesSearch = brand.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLetter =
      !selectedLetter || brand.name.charAt(0).toUpperCase() === selectedLetter;

    // Примечание: фильтрация по категории пока не реализована в API
    // Можно добавить позже, когда в API появится поддержка категорий брендов
    const matchesCategory = true; // Пока всегда true

    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Получаем уникальные первые буквы для алфавитного фильтра
  const availableLetters = Array.from(
    new Set(
      allBrands.map((brand: BrandListItem) =>
        brand.name.charAt(0).toUpperCase(),
      ),
    ),
  ).sort();

  const getCategoryTitle = () => {
    switch (category) {
      case "women":
        return "БРЕНДЫ ЖЕНСКИХ ТОВАРОВ";
      case "men":
        return "БРЕНДЫ МУЖСКИХ ТОВАРОВ";
      case "kids":
        return "БРЕНДЫ ДЕТСКИХ ТОВАРОВ";
      default:
        return "ВСЕ БРЕНДЫ";
    }
  };

  // Группируем бренды по первой букве для алфавитного списка
  const brandsByLetter = filteredBrands.reduce(
    (acc: Record<string, BrandListItem[]>, brand: BrandListItem) => {
      const letter = brand.name.charAt(0).toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(brand);
      return acc;
    },
    {} as Record<string, BrandListItem[]>,
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-wider mb-8">
          {getCategoryTitle()}
        </h1>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="НАЙТИ БРЕНД"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-center border-0 border-b border-gray-300 rounded-none bg-transparent focus:border-black focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Featured Brands Grid */}
      {!searchQuery && !selectedLetter && featuredBrandsList.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-8 text-center">
            ИЗБРАННЫЕ БРЕНДЫ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
            {featuredBrandsList.map((brand: FeaturedBrand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group block"
              >
                <div className="aspect-[3/2] flex items-center justify-center p-4 hover:bg-gray-50 transition-colors border border-gray-200 rounded-lg">
                  <div className="text-center">
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={100}
                        height={100}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-lg md:text-xl font-bold tracking-wider text-black group-hover:text-gray-600 transition-colors">
                        {brand.name}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Alphabet Filter */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-sm tracking-wider">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLetter(null)}
          className={`h-8 px-2 ${selectedLetter === null ? "text-black font-bold" : "text-gray-400 hover:text-black"}`}
        >
          ВСЕ
        </Button>
        {availableLetters.map((letter: string) => (
          <Button
            key={letter}
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLetter(letter)}
            className={`h-8 px-2 ${selectedLetter === letter ? "text-black font-bold" : "text-gray-400 hover:text-black"}`}
          >
            {letter}
          </Button>
        ))}
        {/* Additional characters like numbers */}
        {["1", "2", "3", "4", "7", "№"].map((char: string) => (
          <Button
            key={char}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-400 hover:text-black"
          >
            {char}
          </Button>
        ))}
      </div>

      {/* Alphabetical Brand Listing */}
      {(selectedLetter || searchQuery) && (
        <div className="space-y-12">
          {Object.entries(brandsByLetter)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, letterBrands]) => (
              <div key={letter}>
                <h2 className="text-4xl font-bold mb-8 text-center">
                  {letter}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  {letterBrands.map((brand: BrandListItem) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.slug}`}
                      className="text-sm tracking-wide hover:text-gray-600 transition-colors py-1"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* No Results */}
      {filteredBrands.length === 0 && (searchQuery || selectedLetter) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            По вашему запросу ничего не найдено
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedLetter(null);
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {brandsData?.pagination && (
        <div className="text-center text-sm text-muted-foreground">
          Показано {filteredBrands.length} из {brandsData.pagination.total}{" "}
          брендов
        </div>
      )}
    </div>
  );
}
