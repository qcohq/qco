"use client";

import { Button } from "@qco/ui/components/button";
import { Search, Loader2, Filter } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "./search-input";
import { SearchFilters } from "./search-filters";
import { SearchProductCard } from "./search-product-card";
import type { SearchQuery, SearchResult } from "@qco/web-validators";

// Интерфейс для данных с сервера (с null значениями)
interface ServerSearchResult {
    id: string;
    name: string;
    slug: string;
    brand: {
        id: string;
        name: string;
        slug: string;
    };
    price: number;
    originalPrice: number | undefined;
    discount: number | null;
    image: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    isNew: boolean;
    isSale: boolean;
}

export function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const trpc = useTRPC();

    // Получаем параметры поиска из URL
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const sortBy = searchParams.get("sortBy") as SearchQuery["sortBy"] || "relevance";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

    const [filters, setFilters] = useState<SearchQuery>({
        q: query,
        category: category || undefined,
        brand: brand || undefined,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
    });

    // Обновляем фильтры при изменении URL
    useEffect(() => {
        setFilters({
            q: query,
            category: category || undefined,
            brand: brand || undefined,
            minPrice,
            maxPrice,
            sortBy,
            page,
            limit,
        });
    }, [query, category, brand, minPrice, maxPrice, sortBy, page, limit]);

    // Создаем опции запроса с помощью queryOptions
    const searchQueryOptions = trpc.search.search.queryOptions(filters);

    // Используем опции с хуком useQuery
    const { data: searchData, isPending, error } = useQuery({
        ...searchQueryOptions,
        enabled: !!filters.q && filters.q.trim().length > 0,
        staleTime: 30000, // 30 секунд
    });

    // Обработка изменения фильтров
    const handleFiltersChange = (newFilters: SearchQuery) => {
        const params = new URLSearchParams();

        if (newFilters.q) params.set("q", newFilters.q);
        if (newFilters.category) params.set("category", newFilters.category);
        if (newFilters.brand) params.set("brand", newFilters.brand);
        if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice.toString());
        if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice.toString());
        if (newFilters.sortBy && newFilters.sortBy !== "relevance") params.set("sortBy", newFilters.sortBy);
        if (newFilters.page && newFilters.page > 1) params.set("page", newFilters.page.toString());
        if (newFilters.limit && newFilters.limit !== 20) params.set("limit", newFilters.limit.toString());

        router.push(`/search?${params.toString()}`);
    };

    // Очистка фильтров
    const handleClearFilters = () => {
        router.push(`/search?q=${encodeURIComponent(filters.q)}`);
    };

    // Обработка поиска
    const handleSearch = (searchQuery: string) => {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    // Обработка добавления в избранное
    const handleAddToFavorites = (productId: string) => {
        // Здесь будет логика добавления в избранное
        console.log("Add to favorites:", productId);
    };

    // Обработка добавления в корзину
    const handleAddToCart = async (productId: string) => {
        // Здесь будет логика добавления в корзину
        console.log("Add to cart:", productId);
    };

    // Преобразуем данные для совместимости с типом SearchResult
    const transformedProducts: SearchResult[] = searchData?.products.map((product: ServerSearchResult) => ({
        ...product,
        discount: product.discount || undefined, // Преобразуем null в undefined
    })) || [];

    if (!query) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <Search className="h-16 w-16 text-gray-400 mx-auto" />
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Поиск товаров
                    </h1>
                    <p className="text-gray-600">
                        Введите поисковый запрос, чтобы найти нужные товары
                    </p>
                    <div className="max-w-md mx-auto">
                        <SearchInput
                            placeholder="Начните поиск..."
                            onSearch={handleSearch}
                            autoFocus
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок поиска */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <SearchInput
                        placeholder="Поиск товаров..."
                        onSearch={handleSearch}
                        className="max-w-md"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        onClick={() => {
                            // Показать мобильные фильтры
                        }}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {searchData && (
                    <p className="text-sm text-gray-600">
                        Найдено {searchData.total} товаров по запросу "{query}"
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Фильтры */}
                <div className="lg:col-span-1">
                    <SearchFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Результаты поиска */}
                <div className="lg:col-span-3">
                    {isPending ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            <span className="ml-2 text-gray-600">Поиск товаров...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">Ошибка при поиске: {error.message}</p>
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="mt-4"
                            >
                                Попробовать снова
                            </Button>
                        </div>
                    ) : transformedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Товары не найдены
                            </h3>
                            <p className="text-gray-600 mb-4">
                                По вашему запросу "{query}" ничего не найдено
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/")}
                            >
                                Вернуться на главную
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Сетка товаров */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {transformedProducts.map((product) => (
                                    <SearchProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToFavorites={handleAddToFavorites}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>

                            {/* Пагинация */}
                            {searchData && searchData.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <Button
                                        variant="outline"
                                        disabled={!searchData.hasPrevPage}
                                        onClick={() => {
                                            const newPage = Math.max(1, page - 1);
                                            const params = new URLSearchParams(searchParams);
                                            params.set("page", newPage.toString());
                                            router.push(`/search?${params.toString()}`);
                                        }}
                                    >
                                        Назад
                                    </Button>

                                    <span className="text-sm text-gray-600">
                                        Страница {page} из {searchData.totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        disabled={!searchData.hasNextPage}
                                        onClick={() => {
                                            const newPage = Math.min(searchData.totalPages, page + 1);
                                            const params = new URLSearchParams(searchParams);
                                            params.set("page", newPage.toString());
                                            router.push(`/search?${params.toString()}`);
                                        }}
                                    >
                                        Вперед
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 