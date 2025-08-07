"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { Clock, Search, TrendingUp, X } from "lucide-react";
import { useState } from "react";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = ["Черное платье", "Сумка Hermès", "Кроссовки", "Часы"];

const trendingSearches = [
  "Новая коллекция",
  "Распродажа",
  "Зимние пальто",
  "Украшения",
  "Парфюм",
];

export default function MobileSearchOverlay({
  isOpen,
  onClose,
}: MobileSearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
            autoFocus
          />
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-600">
                Недавние поиски
              </h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  type="button"
                  key={`recent-search-${search}-${index}`}
                  onClick={() => setSearchQuery(search)}
                  className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg"
                >
                  <span className="text-sm">{search}</span>
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-600">
              Популярные запросы
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <button
                type="button"
                key={`trending-search-${search}-${index}`}
                onClick={() => setSearchQuery(search)}
                className="px-3 py-2 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
