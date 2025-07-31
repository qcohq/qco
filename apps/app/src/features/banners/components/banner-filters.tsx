"use client";

import { Badge } from "@qco/ui/components/badge";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Search, X } from "lucide-react";

// TODO: Использовать тип из схемы пропсов фильтров баннеров, если появится в @qco/validators

export function BannerFilters({
  search,
  position,
  page,
  isActive,
  onSearchChange,
  onPositionChange,
  onPageChange,
  onIsActiveChange,
}: {
  search: string;
  position: string;
  page: string;
  isActive: boolean | undefined;
  onSearchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onPageChange: (value: string) => void;
  onIsActiveChange: (value: boolean | undefined) => void;
}) {
  const hasActiveFilters =
    search || position || page || isActive !== undefined;

  const clearFilters = () => {
    onSearchChange("");
    onPositionChange("");
    onPageChange("");
    onIsActiveChange(undefined);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Поиск */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск баннеров..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Позиция */}
            <Select value={position} onValueChange={onPositionChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Позиция" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все позиции</SelectItem>
                <SelectItem value="hero">Главный</SelectItem>
                <SelectItem value="sidebar">Боковая панель</SelectItem>
                <SelectItem value="category-top">Верх категории</SelectItem>
                <SelectItem value="product-top">Верх товара</SelectItem>
                <SelectItem value="footer">Подвал</SelectItem>
                <SelectItem value="popup">Всплывающий</SelectItem>
              </SelectContent>
            </Select>

            {/* Раздел */}
            <Select value={page} onValueChange={onPageChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Раздел" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все разделы</SelectItem>
                <SelectItem value="home">Главная</SelectItem>
                <SelectItem value="category">Категория</SelectItem>
                <SelectItem value="product">Товар</SelectItem>
                <SelectItem value="cart">Корзина</SelectItem>
                <SelectItem value="checkout">Оформление</SelectItem>
              </SelectContent>
            </Select>

            {/* Статус */}
            <Select
              value={
                isActive === undefined ? "all" : isActive ? "true" : "false"
              }
              onValueChange={(value) =>
                onIsActiveChange(value === "all" ? undefined : value === "true")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="true">Активные</SelectItem>
                <SelectItem value="false">Неактивные</SelectItem>
              </SelectContent>
            </Select>

            {/* Кнопка очистки фильтров */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-3"
              >
                <X className="mr-1 h-4 w-4" />
                Очистить
              </Button>
            )}
          </div>
        </div>

        {/* Активные фильтры */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              Активные фильтры:
            </span>

            {search && (
              <Badge variant="secondary" className="text-xs">
                Поиск: "{search}"
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {position && position !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Позиция: {getPositionLabel(position)}
                <button
                  type="button"
                  onClick={() => onPositionChange("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {page && page !== "all" && (
              <Badge variant="secondary" className="text-xs">
                Раздел: {getPageLabel(page)}
                <button
                  type="button"
                  onClick={() => onPageChange("")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {isActive !== undefined && (
              <Badge variant="secondary" className="text-xs">
                Статус: {isActive ? "Активные" : "Неактивные"}
                <button
                  type="button"
                  onClick={() => onIsActiveChange(undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getPositionLabel(position: string): string {
  const positions: Record<string, string> = {
    hero: "Главный",
    sidebar: "Боковая панель",
    "category-top": "Верх категории",
    "product-top": "Верх товара",
    footer: "Подвал",
    popup: "Всплывающий",
  };
  return positions[position] || position;
}

function getPageLabel(page: string): string {
  const pages: Record<string, string> = {
    home: "Главная",
    category: "Категория",
    product: "Товар",
    cart: "Корзина",
    checkout: "Оформление",
  };
  return pages[page] || page;
}
