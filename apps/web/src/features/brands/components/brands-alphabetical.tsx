"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import type { AlphabeticalBrand } from "@qco/web-validators";
import { useBrandsAlphabetical } from "../hooks/use-brands-alphabetical";

interface BrandsAlphabeticalProps {
  categorySlug?: string;
  className?: string;
}

// Skeleton компонент для алфавитного списка брендов
function BrandsAlphabeticalSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Skeleton для алфавитной навигации */}
      <div className="bg-gray-50 rounded-lg p-6">
        <Skeleton className="h-6 w-48 mx-auto mb-4" />
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={`alphabet-skeleton-${index}`} className="w-10 h-10 rounded-md" />
          ))}
        </div>
      </div>

      {/* Skeleton для брендов */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton key={`brand-skeleton-${index}`} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function BrandsAlphabetical({
  categorySlug,
  className = "",
}: BrandsAlphabeticalProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { groupedBrands, availableLetters, totalBrands, isLoading, error } =
    useBrandsAlphabetical({
      categorySlug,
      limit: 1000,
    });

  // Фильтруем бренды по выбранной букве
  const filteredBrands = selectedLetter
    ? groupedBrands[selectedLetter] || []
    : [];

  if (isLoading) {
    return <BrandsAlphabeticalSkeleton className={className} />;
  }

  if (error) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки брендов</h2>
        <p className="text-muted-foreground">Попробуйте обновить страницу</p>
      </div>
    );
  }

  if (totalBrands === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <p className="text-muted-foreground mb-4">
          {categorySlug
            ? "Бренды для данной категории временно недоступны"
            : "Бренды временно недоступны"}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Алфавитная навигация */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Навигация по алфавиту
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {availableLetters.map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedLetter(selectedLetter === letter ? null : letter)
              }
              className="w-10 h-10 p-0 text-sm font-medium hover:scale-105 transition-transform"
            >
              {letter}
            </Button>
          ))}
        </div>
        {selectedLetter && (
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLetter(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              Показать все бренды
            </Button>
          </div>
        )}
      </div>

      {/* Отображение брендов */}
      {selectedLetter ? (
        // Показываем бренды выбранной буквы
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">
            Бренды на букву "{selectedLetter}"
            <span className="text-muted-foreground text-lg font-normal ml-2">
              ({filteredBrands.length}{" "}
              {filteredBrands.length === 1
                ? "бренд"
                : filteredBrands.length < 5
                  ? "бренда"
                  : "брендов"}
              )
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      ) : (
        // Показываем все бренды, сгруппированные по алфавиту
        <div className="space-y-12">
          {availableLetters.map((letter) => {
            const letterBrands = groupedBrands[letter];
            if (!letterBrands || letterBrands.length === 0) return null;

            return (
              <div key={letter} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-bold text-gray-900">{letter}</h3>
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-muted-foreground">
                    {letterBrands.length}{" "}
                    {letterBrands.length === 1
                      ? "бренд"
                      : letterBrands.length < 5
                        ? "бренда"
                        : "брендов"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {letterBrands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Компонент карточки бренда
function BrandCard({ brand }: { brand: AlphabeticalBrand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block w-full"
      aria-label={`Перейти к бренду ${brand.name}`}
    >
      <div className="relative w-full h-20 flex items-center justify-center p-4 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-gray-300 hover:bg-gray-50">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={100}
            height={40}
            className="object-contain max-h-10 w-auto group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              {brand.name}
            </div>
            {brand.country && (
              <div className="text-xs text-muted-foreground mt-1">
                {brand.country}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
