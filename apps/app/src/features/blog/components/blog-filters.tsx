"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { FormLabel } from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { cn } from "@qco/ui/lib/utils";
import { Filter, Search, X } from "lucide-react";
import * as React from "react";

import { BLOG_POST_STATUSES, BLOG_POST_TYPES } from "../types";

interface BlogFiltersFormData {
  search?: string;
  status: string;
  type: string;
}

export type { BlogFiltersFormData };

interface BlogFiltersProps {
  filters: BlogFiltersFormData;
  onFiltersChange: (filters: BlogFiltersFormData) => void;
  className?: string;
}

export function BlogFilters({
  filters,
  onFiltersChange,
  className,
}: BlogFiltersProps) {
  const [localFilters, setLocalFilters] = React.useState<BlogFiltersFormData>({
    search: filters.search || "",
    status: filters.status || "all",
    type: filters.type || "all",
  });

  const handleFilterChange = (
    key: keyof BlogFiltersFormData,
    value: string,
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      status: "all",
      type: "all",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.status !== "all" ||
    localFilters.type !== "all";

  return (
    <div className={cn("mb-6", className)}>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={localFilters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          placeholder="Поиск по заголовку или содержимому..."
          className="pl-10"
        />
      </div>

      {/* Advanced filters */}
      <div className="flex items-center justify-between">
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Дополнительные фильтры
              </span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Активны
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">Статус</FormLabel>
                <Select
                  value={localFilters.status}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({ ...prev, status: value }))
                  }
                  className="w-full"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все статусы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value={BLOG_POST_STATUSES.DRAFT}>
                      Черновик
                    </SelectItem>
                    <SelectItem value={BLOG_POST_STATUSES.PUBLISHED}>
                      Опубликовано
                    </SelectItem>
                    <SelectItem value={BLOG_POST_STATUSES.SCHEDULED}>
                      Запланировано
                    </SelectItem>
                    <SelectItem value={BLOG_POST_STATUSES.ARCHIVED}>
                      В архиве
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FormLabel className="text-sm font-medium">Тип</FormLabel>
                <Select
                  value={localFilters.type}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({ ...prev, type: value }))
                  }
                  className="w-full"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Все типы" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value={BLOG_POST_TYPES.POST}>Записи</SelectItem>
                    <SelectItem value={BLOG_POST_TYPES.PAGE}>
                      Страницы
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4 mr-2" />
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
