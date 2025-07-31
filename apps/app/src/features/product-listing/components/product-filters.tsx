"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { ArrowUpDown, ChevronDown, Filter, Search, X } from "lucide-react";
import { CategoryCombobox } from "~/components/category-combobox";
import type { Category } from "@qco/validators";

interface FilterState {
  search: string;
  categories: string[];
  status: string;
  inStock: boolean;
  onSale: boolean;
  minPrice: number;
  maxPrice: number;
}

// TODO: Использовать тип из схемы пропсов фильтров продуктов, если появится в @qco/validators
interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: unknown) => void;
  onSortChange: (field: string) => void;
  sortConfig: { field: string; order: "asc" | "desc" };
  categories: Category[];
}

export function ProductFilters({
  filters,
  onFilterChange,
  onSortChange,
  sortConfig,
  categories,
}: ProductFiltersProps) {
  // Удаляю View Toggle (блок с кнопками для выбора режима отображения)
  // Удаляю все упоминания onViewModeChange, viewMode
  // Удаляю использование переменной categories и функции findCategoryName
  // В блоке активных фильтров убираю фильтрацию по категориям, если она требует categories
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Поиск товаров..."
            className="w-full pl-8"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryCombobox
            categories={categories}
            value={filters.categories}
            onChange={(value: string | string[]) => {
              // Преобразуем значение в массив строк
              const values = Array.isArray(value) ? value : [value];
              onFilterChange("categories", values);
            }}
            multiple={true}
            placeholder="Выберите категории"
            showBadges={true}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Фильтры</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Фильтровать по</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Фильтр по статусу */}
              <DropdownMenuItem>
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox
                    id="filter-active"
                    className="mr-2"
                    checked={filters.status === "active"}
                    onCheckedChange={(checked) =>
                      onFilterChange("status", checked ? "active" : "all")
                    }
                  />
                  <Label htmlFor="filter-active">Только активные</Label>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox
                    id="filter-in-stock"
                    className="mr-2"
                    checked={filters.inStock}
                    onCheckedChange={(checked) =>
                      onFilterChange("inStock", checked)
                    }
                  />
                  <Label htmlFor="filter-in-stock">Только в наличии</Label>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div className="flex items-center space-x-2 w-full">
                  <Checkbox
                    id="filter-on-sale"
                    className="mr-2"
                    checked={filters.onSale}
                    onCheckedChange={(checked) =>
                      onFilterChange("onSale", checked)
                    }
                  />
                  <Label htmlFor="filter-on-sale">Со скидкой</Label>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Фильтр по ценам */}
              <div className="px-2 py-1">
                <Label className="text-sm font-medium">Диапазон цен</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    placeholder="От"
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      onFilterChange("minPrice", Number(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">—</span>
                  <Input
                    type="number"
                    placeholder="До"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      onFilterChange(
                        "maxPrice",
                        Number(e.target.value) || 100000,
                      )
                    }
                    className="w-20"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <ArrowUpDown className="h-4 w-4" />
                <span>Сортировка</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortChange("name")}>
                Названию{" "}
                {sortConfig.field === "name" &&
                  (sortConfig.order === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("price")}>
                Цене{" "}
                {sortConfig.field === "price" &&
                  (sortConfig.order === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("stock")}>
                Наличию{" "}
                {sortConfig.field === "stock" &&
                  (sortConfig.order === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("date")}>
                Дате добавления{" "}
                {sortConfig.field === "date" &&
                  (sortConfig.order === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Активные фильтры */}
          {(filters.search ||
            filters.categories?.length > 0 ||
            filters.inStock ||
            filters.onSale ||
            filters.status !== "all" ||
            filters.minPrice > 0 ||
            filters.maxPrice < 100000) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.search && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    Поиск: {filters.search}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => onFilterChange("search", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.categories &&
                  filters.categories.length > 0 &&
                  filters.categories.map((catId) => (
                    <Badge
                      key={catId}
                      variant="outline"
                      className="bg-muted/50 rounded-sm px-2 py-1"
                    >
                      Категория:{" "}
                      {/* Удаляю findCategoryName, так как categories не передается */}
                      {catId}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="-mr-1 ml-1 h-4 w-4"
                        onClick={() =>
                          onFilterChange(
                            "categories",
                            filters.categories.filter((id) => id !== catId),
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}

                {filters.inStock && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    В наличии
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => onFilterChange("inStock", false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.status === "active" && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    Активные
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => onFilterChange("status", "all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.inStock && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    В наличии
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => onFilterChange("inStock", false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {filters.onSale && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    Со скидкой
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => onFilterChange("onSale", false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {(filters.minPrice > 0 || filters.maxPrice < 100000) && (
                  <Badge
                    variant="outline"
                    className="bg-muted/50 rounded-sm px-2 py-1"
                  >
                    Цена: {filters.minPrice} — {filters.maxPrice} ₽
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1 ml-1 h-4 w-4"
                      onClick={() => {
                        onFilterChange("minPrice", 0);
                        onFilterChange("maxPrice", 100000);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    onFilterChange("search", "");
                    onFilterChange("categories", []);
                    onFilterChange("status", "all");
                    onFilterChange("inStock", false);
                    onFilterChange("onSale", false);
                    onFilterChange("minPrice", 0);
                    onFilterChange("maxPrice", 100000);
                  }}
                >
                  Сбросить все
                </Button>
              </div>
            )}
        </div>
      </div>
    </Card>
  );
}
