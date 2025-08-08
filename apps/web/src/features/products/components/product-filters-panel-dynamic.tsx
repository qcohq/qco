"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { RangeSlider } from "@/components/ui/range-slider";
import { Separator } from "@qco/ui/components/separator";
import { Skeleton } from "@qco/ui/components/skeleton";
import { ChevronDown, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDynamicCategoryFilters } from "../hooks/use-dynamic-category-filters";
import { useDebouncedPriceFilter } from "../hooks/use-debounced-price-filter";
import type { CatalogFilters } from "../types/catalog";

interface ProductFiltersPanelDynamicProps {
    // applied + draft режим: отображаем значения из draft
    filters: CatalogFilters;
    appliedFilters?: CatalogFilters;
    onFilterChange: (filterType: keyof CatalogFilters, value: any) => void;
    onClearFilters: () => void;
    onApply?: () => void;
    isRefetching?: boolean;
    categorySlug: string; // Обязательный параметр категории
}

export default function ProductFiltersPanelDynamic({
    filters,
    appliedFilters,
    onFilterChange,
    onClearFilters,
    onApply,
    isRefetching,
    categorySlug,
}: ProductFiltersPanelDynamicProps) {
    const [openSections, setOpenSections] = useState<string[]>([
        "price",
        "brands",
        "sizes",
        "colors",
    ]);

    // Используем новый хук для получения динамических фильтров
    const { filters: availableFilters, isInitialLoading, isRefetching: isFiltersRefetching, hasFilters } = useDynamicCategoryFilters({
        categorySlug,
        appliedFilters: appliedFilters ?? filters,
    });

    // Используем умный дебаунсинг для фильтра цены
    const {
        localPriceRange,
        inputValues,
        isDebouncing,
        handleSliderChange,
        handleMinPriceInputChange,
        handleMaxPriceInputChange,
        handleMinPriceBlur,
        handleMaxPriceBlur,
    } = useDebouncedPriceFilter({
        initialPriceRange: filters.priceRange,
        onPriceChange: (priceRange) => onFilterChange("priceRange", priceRange),
        debounceDelay: 800,
    });

    const toggleSection = (section: string) => {
        setOpenSections((prev) =>
            prev.includes(section)
                ? prev.filter((s) => s !== section)
                : [...prev, section],
        );
    };

    // Проверяем, есть ли валидный ценовой диапазон
    const hasValidPriceRange = availableFilters.priceRange.max > availableFilters.priceRange.min;

    const handleSizeChange = (size: string, checked: boolean) => {
        const currentSizes = filters.sizes || [];
        if (checked) {
            onFilterChange("sizes", [...currentSizes, size]);
        } else {
            onFilterChange("sizes", currentSizes.filter((s) => s !== size));
        }
    };

    const handleColorChange = (color: string, checked: boolean) => {
        const currentColors = filters.colors || [];
        if (checked) {
            onFilterChange("colors", [...currentColors, color]);
        } else {
            onFilterChange("colors", currentColors.filter((c) => c !== color));
        }
    };

    const handleBrandChange = (brand: string, checked: boolean) => {
        const currentBrands = filters.brands || [];
        if (checked) {
            onFilterChange("brands", [...currentBrands, brand]);
        } else {
            onFilterChange("brands", currentBrands.filter((b) => b !== brand));
        }
    };

    // Показываем скелетон только на первоначальной загрузке
    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Separator />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-16" />
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Если нет доступных фильтров, показываем сообщение
    if (!hasFilters) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    Нет доступных фильтров для данной категории
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Заголовок с количеством товаров */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Фильтры</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-xs"
                >
                    Очистить все
                </Button>
            </div>

            {/* Индикация применения (без скелетона) */}
            {(isFiltersRefetching || isRefetching) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Обновляем доступные опции...</span>
                </div>
            )}

            {/* Цена */}
            {hasValidPriceRange && (
                <>
                    <Collapsible
                        open={openSections.includes("price")}
                        onOpenChange={() => toggleSection("price")}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium">Цена</h4>
                                {isDebouncing && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 animate-pulse" />
                                        <span>Применяется...</span>
                                    </div>
                                )}
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                            <RangeSlider
                                value={localPriceRange}
                                onValueChange={handleSliderChange}
                                max={availableFilters.priceRange.max}
                                min={availableFilters.priceRange.min}
                                step={1000}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="От"
                                    value={inputValues[0]}
                                    onChange={(e) => handleMinPriceInputChange(e.target.value)}
                                    onBlur={handleMinPriceBlur}
                                    min={availableFilters.priceRange.min}
                                    max={availableFilters.priceRange.max}
                                />
                                <Input
                                    type="number"
                                    placeholder="До"
                                    value={inputValues[1]}
                                    onChange={(e) => handleMaxPriceInputChange(e.target.value)}
                                    onBlur={handleMaxPriceBlur}
                                    min={availableFilters.priceRange.min}
                                    max={availableFilters.priceRange.max}
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {availableFilters.priceRange.min.toLocaleString()} ₽ - {availableFilters.priceRange.max.toLocaleString()} ₽
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                </>
            )}

            {/* Бренды */}
            {availableFilters.brands && availableFilters.brands.length > 0 && (
                <>
                    <Collapsible
                        open={openSections.includes("brands")}
                        onOpenChange={() => toggleSection("brands")}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                            <h4 className="font-medium">Бренды</h4>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-4">
                            {availableFilters.brands.map((brand) => (
                                <div key={brand.name} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`brand-${brand.name}`}
                                        checked={filters.brands.includes(brand.name)}
                                        onCheckedChange={(checked) =>
                                            handleBrandChange(brand.name, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`brand-${brand.name}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {brand.name} ({brand.count})
                                    </Label>
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                </>
            )}

            {/* Размеры */}
            {availableFilters.sizes && availableFilters.sizes.length > 0 && (
                <>
                    <Collapsible
                        open={openSections.includes("sizes")}
                        onOpenChange={() => toggleSection("sizes")}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                            <h4 className="font-medium">Размеры</h4>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-4">
                            {availableFilters.sizes.map((size) => (
                                <div key={size.name} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`size-${size.name}`}
                                        checked={filters.sizes.includes(size.name)}
                                        onCheckedChange={(checked) =>
                                            handleSizeChange(size.name, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`size-${size.name}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {size.name} ({size.count})
                                    </Label>
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                </>
            )}

            {/* Цвета */}
            {availableFilters.colors && availableFilters.colors.length > 0 && (
                <>
                    <Collapsible
                        open={openSections.includes("colors")}
                        onOpenChange={() => toggleSection("colors")}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                            <h4 className="font-medium">Цвета</h4>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-4">
                            {availableFilters.colors.map((color) => (
                                <div key={color.name} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`color-${color.name}`}
                                        checked={filters.colors.includes(color.name)}
                                        onCheckedChange={(checked) =>
                                            handleColorChange(color.name, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`color-${color.name}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {color.name} ({color.count})
                                    </Label>
                                </div>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                </>
            )}

            {/* Дополнительные фильтры */}
            {availableFilters.inStock !== undefined && (
                <>
                    <Collapsible
                        open={openSections.includes("availability")}
                        onOpenChange={() => toggleSection("availability")}
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                            <h4 className="font-medium">Наличие</h4>
                            <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="inStock"
                                    checked={filters.inStock}
                                    onCheckedChange={(checked) =>
                                        onFilterChange("inStock", checked as boolean)
                                    }
                                />
                                <Label htmlFor="inStock" className="text-sm font-normal cursor-pointer">
                                    В наличии
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="onSale"
                                    checked={filters.onSale}
                                    onCheckedChange={(checked) =>
                                        onFilterChange("onSale", checked as boolean)
                                    }
                                />
                                <Label htmlFor="onSale" className="text-sm font-normal cursor-pointer">
                                    Со скидкой
                                </Label>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator />
                </>
            )}

            {/* Динамические атрибуты */}
            {availableFilters.attributes && Object.keys(availableFilters.attributes).length > 0 && (
                <>
                    {Object.entries(availableFilters.attributes).map(([attributeSlug, attribute]) => (
                        <Collapsible
                            key={attributeSlug}
                            open={openSections.includes(attributeSlug)}
                            onOpenChange={() => toggleSection(attributeSlug)}
                        >
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <h4 className="font-medium">{attribute.name}</h4>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2 pt-4">
                                {attribute.values.map((value) => (
                                    <div key={value.name} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${attributeSlug}-${value.name}`}
                                            checked={filters.attributes[attributeSlug]?.includes(value.name) || false}
                                            onCheckedChange={(checked) => {
                                                const currentValues = filters.attributes[attributeSlug] || [];
                                                const newValues = checked
                                                    ? [...currentValues, value.name]
                                                    : currentValues.filter((v) => v !== value.name);
                                                onFilterChange("attributes", {
                                                    ...filters.attributes,
                                                    [attributeSlug]: newValues,
                                                });
                                            }}
                                        />
                                        <Label
                                            htmlFor={`${attributeSlug}-${value.name}`}
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {value.name} ({value.count})
                                        </Label>
                                    </div>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            )}

            {/* Кнопка применения */}
            {onApply && (
                <div className="pt-2">
                    <Button className="w-full" onClick={onApply} disabled={isRefetching || isFiltersRefetching}>
                        {(isRefetching || isFiltersRefetching) && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Применить
                    </Button>
                </div>
            )}
        </div>
    );
} 