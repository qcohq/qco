"use client";

import { Button } from "@qco/ui/components/button";
import { Clock, Search, X, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchInput } from "./search-input";
import { useSearch } from "../hooks/use-search";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const recentSearches = ["платье", "кроссовки", "сумка"];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [activeTab, setActiveTab] = useState<"history" | "popular">("history");
    const router = useRouter();
    const { searchHistory, popularSearches, addToHistory, clearHistory } = useSearch();
    const trpc = useTRPC();

    // Создаем опции запроса для популярных товаров
    const popularProductsQueryOptions = trpc.search.search.queryOptions({
        q: "",
        limit: 4,
        sortBy: "popular",
    });

    // Получаем популярные товары
    const { data: popularProductsData } = useQuery({
        ...popularProductsQueryOptions,
        enabled: activeTab === "popular",
        staleTime: 300000, // 5 минут
    });

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
            addToHistory(query.trim());
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-white">
            {/* Search Header */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Search className="h-6 w-6 text-gray-400 flex-shrink-0" />
                        <SearchInput
                            placeholder="Поиск товаров..."
                            className="flex-1 border-none text-lg p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                            onSearch={handleSearch}
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
                        {searchHistory.length > 0 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Недавние поиски</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearHistory}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Очистить
                                </Button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchHistory.map((query) => (
                                <button
                                    key={query}
                                    type="button"
                                    onClick={() => handleSearch(query)}
                                    className="text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm font-medium">{query}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {popularSearches.length > 0 && (
                            <>
                                <div className="flex items-center gap-2 mt-8">
                                    <TrendingUp className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Популярные запросы</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {popularSearches.slice(0, 6).map((search) => (
                                        <button
                                            key={search.query}
                                            type="button"
                                            onClick={() => handleSearch(search.query)}
                                            className="text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{search.query}</span>
                                                <span className="text-xs text-gray-500">{search.count}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Popular Products Tab */}
                {activeTab === "popular" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Популярные товары</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {popularProductsData?.products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.slug}`}
                                    className="group block"
                                    onClick={onClose}
                                >
                                    <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-3">
                                        <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                        {product.isNew && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                    NEW
                                                </span>
                                            </div>
                                        )}
                                        {product.isSale && (
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                    SALE
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{product.brand.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatPrice(product.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 