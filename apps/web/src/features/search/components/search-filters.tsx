"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@qco/ui/components/select";
import { Separator } from "@qco/ui/components/separator";
import { Slider } from "@qco/ui/components/slider";
import { Badge } from "@qco/ui/components/badge";
import { Filter, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchQuery } from "@qco/web-validators";

interface SearchFiltersProps {
    filters: SearchQuery;
    onFiltersChange: (filters: SearchQuery) => void;
    onClearFilters: () => void;
    className?: string;
}

export function SearchFilters({
    filters,
    onFiltersChange,
    onClearFilters,
    className = "",
}: SearchFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const trpc = useTRPC();

    // Локальное состояние для полей цены с умной задержкой
    const [localMinPrice, setLocalMinPrice] = useState<number | undefined>(filters.minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState<number | undefined>(filters.maxPrice);

    // Дебаунсированные значения для применения фильтров
    const debouncedMinPrice = useDebounce(localMinPrice, 800); // 800ms задержка
    const debouncedMaxPrice = useDebounce(localMaxPrice, 800); // 800ms задержка

    // Состояние для индикации задержки
    const [isPriceDebouncing, setIsPriceDebouncing] = useState(false);

    // Создаем опции запроса для категорий
    const categoriesQueryOptions = trpc.search.getCategories.queryOptions();

    // Создаем опции запроса для брендов
    const brandsQueryOptions = trpc.search.getBrands.queryOptions();

    // Получаем категории и бренды для фильтров
    const { data: categories } = useQuery({
        ...categoriesQueryOptions,
        staleTime: 300000, // 5 минут
    });

    const { data: brands } = useQuery({
        ...brandsQueryOptions,
        staleTime: 300000, // 5 минут
    });

    // Синхронизируем локальное состояние с фильтрами
    useEffect(() => {
        setLocalMinPrice(filters.minPrice);
        setLocalMaxPrice(filters.maxPrice);
    }, [filters.minPrice, filters.maxPrice]);

    // Отслеживаем изменения локальных значений для индикации задержки
    useEffect(() => {
        const isLocalDifferent =
            localMinPrice !== filters.minPrice ||
            localMaxPrice !== filters.maxPrice;

        setIsPriceDebouncing(isLocalDifferent);
    }, [localMinPrice, localMaxPrice, filters.minPrice, filters.maxPrice]);

    // Применяем дебаунсированные значения цены
    useEffect(() => {
        if (debouncedMinPrice !== filters.minPrice || debouncedMaxPrice !== filters.maxPrice) {
            const newFilters = {
                ...filters,
                minPrice: debouncedMinPrice,
                maxPrice: debouncedMaxPrice,
                page: 1, // Сбрасываем страницу при изменении цены
            };
            onFiltersChange(newFilters);
        }
    }, [debouncedMinPrice, debouncedMaxPrice, filters, onFiltersChange]);

    const handleFilterChange = (key: keyof SearchQuery, value: any) => {
        const newFilters = {
            ...filters,
            [key]: value,
        };

        // Сбрасываем страницу при изменении фильтров
        if (key !== "page" && key !== "limit") {
            newFilters.page = 1;
        }

        onFiltersChange(newFilters);
    };

    const handlePriceChange = (values: number[]) => {
        // Для слайдера применяем изменения сразу
        const newFilters = {
            ...filters,
            minPrice: values[0],
            maxPrice: values[1],
            page: 1, // Сбрасываем страницу при изменении цены
        };
        onFiltersChange(newFilters);

        // Обновляем локальное состояние
        setLocalMinPrice(values[0]);
        setLocalMaxPrice(values[1]);
    };

    const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? undefined : Number(e.target.value);
        setLocalMinPrice(value);
    };

    const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? undefined : Number(e.target.value);
        setLocalMaxPrice(value);
    };

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        if (key === "q" || key === "page" || key === "limit") return false; // Исключаем основные параметры
        return value !== undefined && value !== "" && value !== null;
    }).length;

    return (
        <div className={className}>
            {/* Мобильная кнопка фильтров */}
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Фильтры</span>
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </div>
                </Button>
            </div>

            {/* Десктопные фильтры */}
            <div className={`${isOpen ? "block" : "hidden"} md:block space-y-6`}>
                {/* Сортировка */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Сортировка</Label>
                    <Select
                        value={filters.sortBy || "relevance"}
                        onValueChange={(value) => handleFilterChange("sortBy", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите сортировку" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">По релевантности</SelectItem>
                            <SelectItem value="price_asc">По цене (возрастание)</SelectItem>
                            <SelectItem value="price_desc">По цене (убывание)</SelectItem>
                            <SelectItem value="newest">Сначала новые</SelectItem>
                            <SelectItem value="popular">По популярности</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                {/* Цена */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Цена</Label>
                        {isPriceDebouncing && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 animate-pulse" />
                                <span>Применяется...</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <Slider
                            value={[filters.minPrice || 0, filters.maxPrice || 10000000]}
                            onValueChange={handlePriceChange}
                            max={10000000}
                            min={0}
                            step={100000}
                            className="w-full"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label htmlFor="min-price" className="text-xs text-gray-500">
                                    От
                                </Label>
                                <Input
                                    id="min-price"
                                    type="number"
                                    placeholder="0"
                                    value={localMinPrice || ""}
                                    onChange={handleMinPriceInputChange}
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="max-price" className="text-xs text-gray-500">
                                    До
                                </Label>
                                <Input
                                    id="max-price"
                                    type="number"
                                    placeholder="10,000,000"
                                    value={localMaxPrice || ""}
                                    onChange={handleMaxPriceInputChange}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Категории */}
                {categories && categories.length > 0 && (
                    <>
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Категории</Label>
                            <Select
                                value={filters.category || "all"}
                                onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все категории</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.slug} value={category.slug}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />
                    </>
                )}

                {/* Бренды */}
                {brands && brands.length > 0 && (
                    <>
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Бренды</Label>
                            <Select
                                value={filters.brand || "all"}
                                onValueChange={(value) => handleFilterChange("brand", value === "all" ? undefined : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите бренд" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все бренды</SelectItem>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.slug} value={brand.slug}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />
                    </>
                )}

                {/* Кнопка очистки фильтров */}
                {activeFiltersCount > 0 && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="w-full"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Очистить фильтры
                    </Button>
                )}
            </div>
        </div>
    );
} 