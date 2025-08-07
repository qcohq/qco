"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { Clock, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = ["платье"];

const popularSearches = ["premiata", "платье", "сумка", "кроссовки"];

const popularProducts = [
  {
    id: 1,
    brand: "PHILIPP PLEIN",
    name: "Кожаная куртка",
    price: "13 178 400 ₽",
    image: "/placeholder.svg?height=400&width=300",
    href: "/products/1",
  },
  {
    id: 2,
    brand: "BALMAIN",
    name: "Кроссовки комбинированные Unicorn",
    price: "92 890 ₽",
    originalPrice: "132 700 ₽",
    discount: "-30%",
    image: "/placeholder.svg?height=400&width=300",
    href: "/products/2",
  },
  {
    id: 3,
    brand: "ANTE KOVAC",
    name: "Сумка трансформер «Гвоздика», летняя, розав",
    price: "175 000 ₽",
    image: "/placeholder.svg?height=400&width=300",
    href: "/products/3",
  },
  {
    id: 4,
    brand: "POLINA MIRCHEVA",
    name: "Платье свадебное",
    price: "250 000 ₽",
    image: "/placeholder.svg?height=400&width=300",
    href: "/products/4",
  },
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "popular">("history");
  const [recentSearchesList, setRecentSearchesList] = useState(recentSearches);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const clearHistory = () => {
    setRecentSearchesList([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white">
      {/* Search Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Search className="h-6 w-6 text-gray-400 flex-shrink-0" />
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-none text-lg p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === "history"
              ? "text-black border-black"
              : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
          >
            ИСТОРИЯ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("popular")}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === "popular"
              ? "text-black border-black"
              : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
          >
            ПОПУЛЯРНЫЕ ТОВАРЫ
          </button>
        </div>

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {recentSearchesList.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Недавние поиски</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Очистить
                </Button>
              </div>
            )}

            {recentSearchesList.length > 0 ? (
              <div className="space-y-2">
                {recentSearchesList.map((search, index) => (
                  <button
                    type="button"
                    key={`recent-search-${search}-${index}`}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">История поиска пуста</p>
            )}

            {/* Popular Searches in History Tab */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                ЧАСТО ИЩУТ
              </h3>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    type="button"
                    key={`popular-search-${search}-${index}`}
                    onClick={() => handleSearch(search)}
                    className="flex items-center gap-3 w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popular Products Tab */}
        {activeTab === "popular" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link key={product.id} href={product.href} onClick={onClose}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
                    {product.discount && (
                      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.discount}
                      </div>
                    )}
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm text-gray-900 uppercase tracking-wide">
                      {product.brand}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
